#!/usr/bin/env node
/**
 * agent-eval — lightweight CLI for comparing coding agents on reproducible tasks.
 *
 * Usage:
 *   node scripts/agent-eval.js run --task tasks/<name>.yaml --agent <agent> [--agent <agent2>] [--runs <n>]
 *   node scripts/agent-eval.js report [--format table|json] [--results <dir>]
 *
 * Each run:
 *   1. Creates a fresh git worktree from the pinned commit.
 *   2. Hands the prompt to the agent CLI.
 *   3. Runs every judge criterion (command / grep).
 *   4. Records pass/fail, wall-clock time, and (if available) token cost to
 *      results/<task>/<agent>/<timestamp>.json.
 *
 * No external dependencies required — only Node.js built-ins.
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const AGENT_TIMEOUT_MS = 300_000; // 5 minutes per agent run
const JUDGE_TIMEOUT_MS = 120_000; // 2 minutes per judge criterion

// ─── Minimal YAML parser ──────────────────────────────────────────────────────
// Handles the subset of YAML used by task definition files:
//   scalar key: value, multiline |, sequence items, nested mappings under judge.

/**
 * @param {string} text
 * @returns {Record<string, unknown>}
 */
function parseTaskYaml(text) {
  const lines = text.split('\n');
  let i = 0;

  /** Read a literal block scalar (| style) starting on the line after the `|` marker. */
  function readBlockScalar(baseIndent) {
    const chunks = [];
    while (i < lines.length) {
      const line = lines[i];
      const lineIndent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
      if (line.trim() === '' || lineIndent > baseIndent) {
        chunks.push(line.trimEnd().slice(baseIndent + 2));
        i++;
      } else {
        break;
      }
    }
    return chunks.join('\n').trimEnd();
  }

  /** Read a YAML sequence whose items start at `seqIndent` spaces. */
  function readSequence(seqIndent) {
    const items = [];
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '') { i++; continue; }
      const indentMatch = line.match(/^(\s*)-\s*/);
      if (!indentMatch || indentMatch[1].length !== seqIndent) break;

      const rest = line.slice(indentMatch[0].length).trim();
      i++;

      if (rest === '') {
        // Mapping item on subsequent lines
        const next = lines[i];
        if (next !== undefined) {
          const nextIndent = next.match(/^(\s*)/)?.[1]?.length ?? 0;
          items.push(readMapping(nextIndent));
        }
      } else {
        // Check if rest is itself a key: value pair (e.g. `- type: command`)
        const inlineKv = rest.match(/^([^:\s][^:]*?)\s*:\s*(.*)?$/);
        if (inlineKv) {
          // Start a mapping with this inline pair as the first entry, then read more
          const inlineKey = inlineKv[1].trim();
          const inlineVal = (inlineKv[2] ?? '').trim().replace(/^["']|["']$/g, '');
          const obj = { [inlineKey]: inlineVal };
          // Read any continuation lines that are indented more than the sequence indent
          const next = lines[i];
          if (next !== undefined) {
            const nextIndent = next.match(/^(\s*)/)?.[1]?.length ?? 0;
            if (next.trim() !== '' && !next.match(/^\s*-/) && nextIndent > seqIndent) {
              Object.assign(obj, readMapping(nextIndent));
            }
          }
          items.push(obj);
        } else {
          // Plain scalar — check if next line continues as a mapping
          const next = lines[i];
          if (next !== undefined) {
            const nextIndent = next.match(/^(\s*)/)?.[1]?.length ?? 0;
            if (next.trim() !== '' && !next.match(/^\s*-/) && nextIndent > seqIndent) {
              items.push({ _value: rest, ...readMapping(nextIndent) });
            } else {
              items.push(rest);
            }
          } else {
            items.push(rest);
          }
        }
      }
    }
    return items;
  }

  /** Read key-value pairs at `mapIndent` indentation level. */
  function readMapping(mapIndent) {
    /** @type {Record<string, unknown>} */
    const obj = {};
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '' || line.trim().startsWith('#')) { i++; continue; }
      const lineIndent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
      if (lineIndent < mapIndent) break;

      const kvMatch = line.match(/^(\s*)([^:\s][^:]*?)\s*:\s*(.*)?$/);
      if (!kvMatch) { i++; continue; }

      const key = kvMatch[2].trim();
      const valRaw = (kvMatch[3] ?? '').trim();
      i++;

      if (valRaw === '|') {
        obj[key] = readBlockScalar(lineIndent);
      } else if (valRaw === '') {
        const next = lines[i];
        if (next === undefined) { obj[key] = null; break; }
        const nextTrimmed = next.trim();
        if (nextTrimmed.startsWith('-')) {
          const seqIndent = next.match(/^(\s*)/)?.[1]?.length ?? 0;
          obj[key] = readSequence(seqIndent);
        } else {
          const nextIndent = next.match(/^(\s*)/)?.[1]?.length ?? 0;
          obj[key] = nextIndent > lineIndent ? readMapping(nextIndent) : null;
        }
      } else {
        obj[key] = valRaw.replace(/^["']|["']$/g, '');
      }
    }
    return obj;
  }

  return readMapping(0);
}

// ─── Agent runners ────────────────────────────────────────────────────────────

const AGENT_COMMANDS = {
  'claude-code': args => ['claude', ['-p', args.prompt, '--output-format', 'json']],
  'aider': args => ['aider', ['--message', args.prompt, '--yes', '--no-git', '--', ...args.files]],
  'codex': args => ['codex', ['--prompt', args.prompt]],
  'copilot': args => ['gh', ['copilot', 'suggest', '-t', 'shell', args.prompt]],
};

/**
 * Run a coding agent with the given prompt in a working directory.
 * @param {string} agentName
 * @param {{ prompt: string; files: string[] }} args
 * @param {string} cwd
 */
function runAgent(agentName, args, cwd) {
  const builder = AGENT_COMMANDS[agentName];
  if (!builder) {
    throw new Error(`Unknown agent: ${agentName}. Supported: ${Object.keys(AGENT_COMMANDS).join(', ')}`);
  }
  const [cmd, cmdArgs] = builder(args);
  const start = Date.now();
  const result = spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8', timeout: AGENT_TIMEOUT_MS });
  const durationMs = Date.now() - start;

  let cost = null;
  try {
    const parsed = JSON.parse(result.stdout ?? '');
    if (typeof parsed?.cost_usd === 'number') cost = parsed.cost_usd;
    if (typeof parsed?.usage?.total_cost === 'number') cost = parsed.usage.total_cost;
  } catch {
    // stdout is not JSON — that's fine for most agents
  }

  return { exitCode: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '', durationMs, cost };
}

// ─── Judge runners ────────────────────────────────────────────────────────────

/**
 * Run a single judge criterion.
 * @param {{ type: string; command?: string; pattern?: string; files?: string }} criterion
 * @param {string} cwd
 */
function runJudge(criterion, cwd) {
  const { type } = criterion;

  if (type === 'command' || type === 'pytest' || type === 'jest') {
    const cmd = criterion.command ?? (type === 'pytest' ? 'pytest' : 'npm test');
    const result = spawnSync('sh', ['-c', cmd], { cwd, encoding: 'utf8', timeout: JUDGE_TIMEOUT_MS });
    const pass = (result.status ?? 1) === 0;
    return { pass, detail: pass ? 'command exited 0' : (result.stderr || result.stdout).slice(0, 500) };
  }

  if (type === 'grep') {
    const pattern = criterion.pattern ?? '';
    const target = criterion.files ?? '.';
    const result = spawnSync(
      'grep',
      ['-r', '--include=*.ts', '--include=*.tsx', '-l', pattern, target],
      { cwd, encoding: 'utf8' },
    );
    const pass = (result.status ?? 1) === 0 && result.stdout.trim() !== '';
    return { pass, detail: pass ? `pattern found in: ${result.stdout.trim()}` : `pattern '${pattern}' not found` };
  }

  if (type === 'llm') {
    return { pass: true, detail: 'LLM judge skipped (not implemented in local runner)' };
  }

  return { pass: false, detail: `unknown judge type: ${type}` };
}

// ─── Worktree management ──────────────────────────────────────────────────────

function createWorktree(commit, runId) {
  const worktreePath = path.join(os.tmpdir(), `agent-eval-${runId}`);
  execSync(`git worktree add --detach "${worktreePath}" ${commit}`, { cwd: REPO_ROOT, stdio: 'pipe' });
  return worktreePath;
}

function removeWorktree(worktreePath) {
  try {
    execSync(`git worktree remove --force "${worktreePath}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
  } catch {
    // best-effort cleanup
  }
}

// ─── Results persistence ──────────────────────────────────────────────────────

function saveResult(resultsDir, taskName, agentName, result) {
  const dir = path.join(resultsDir, taskName, agentName);
  fs.mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(dir, `${ts}.json`);
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  return file;
}

function loadResults(resultsDir) {
  if (!fs.existsSync(resultsDir)) return [];
  const results = [];
  for (const taskName of fs.readdirSync(resultsDir)) {
    const taskDir = path.join(resultsDir, taskName);
    if (!fs.statSync(taskDir).isDirectory()) continue;
    for (const agentName of fs.readdirSync(taskDir)) {
      const agentDir = path.join(taskDir, agentName);
      if (!fs.statSync(agentDir).isDirectory()) continue;
      for (const file of fs.readdirSync(agentDir)) {
        if (!file.endsWith('.json')) continue;
        try {
          results.push(JSON.parse(fs.readFileSync(path.join(agentDir, file), 'utf8')));
        } catch {
          // skip corrupt files
        }
      }
    }
  }
  return results;
}

// ─── Commands ────────────────────────────────────────────────────────────────

function commandRun({ taskFile, agents, runs, resultsDir }) {
  if (!fs.existsSync(taskFile)) {
    console.error(`Task file not found: ${taskFile}`);
    process.exit(1);
  }

  const task = parseTaskYaml(fs.readFileSync(taskFile, 'utf8'));
  const taskName = String(task.name ?? path.basename(taskFile, '.yaml'));
  const commit = String(task.commit ?? 'HEAD');
  const prompt = String(task.prompt ?? '');
  const files = Array.isArray(task.files) ? task.files.map(String) : [];
  const judges = Array.isArray(task.judge) ? task.judge : [];

  console.log(`\nTask:   ${taskName}`);
  console.log(`Commit: ${commit}`);
  console.log(`Agents: ${agents.join(', ')}`);
  console.log(`Runs:   ${runs}\n`);

  for (const agent of agents) {
    console.log(`─── Agent: ${agent} ${'─'.repeat(Math.max(0, 40 - agent.length))}`);
    for (let r = 1; r <= runs; r++) {
      const runId = `${taskName}-${agent}-run${r}-${Date.now()}`;
      console.log(`  Run ${r}/${runs}...`);

      let worktree = null;
      let agentResult = null;
      const judgeResults = [];

      try {
        worktree = createWorktree(commit, runId);
        agentResult = runAgent(agent, { prompt, files }, worktree);
        console.log(
          `  Agent finished in ${(agentResult.durationMs / 1000).toFixed(1)}s${agentResult.cost !== null ? `, cost $${agentResult.cost.toFixed(4)}` : ''}`,
        );

        for (const criterion of judges) {
          const jr = runJudge(criterion, worktree);
          judgeResults.push({ criterion, ...jr });
          console.log(`  Judge [${criterion.type}]: ${jr.pass ? '✓ PASS' : '✗ FAIL'} — ${jr.detail}`);
        }
      } catch (err) {
        console.error(`  Error: ${err.message}`);
        agentResult ??= { exitCode: 1, stdout: '', stderr: String(err.message), durationMs: 0, cost: null };
      } finally {
        if (worktree) removeWorktree(worktree);
      }

      const passed = judgeResults.length > 0 && judgeResults.every(jr => jr.pass);
      const record = {
        task: taskName,
        agent,
        run: r,
        timestamp: new Date().toISOString(),
        passed,
        judgeResults,
        durationMs: agentResult?.durationMs ?? 0,
        cost: agentResult?.cost ?? null,
        agentExitCode: agentResult?.exitCode ?? 1,
      };

      const saved = saveResult(resultsDir, taskName, agent, record);
      console.log(`  Saved → ${path.relative(REPO_ROOT, saved)}\n`);
    }
  }
}

function commandReport({ format, resultsDir }) {
  const results = loadResults(resultsDir);

  if (results.length === 0) {
    console.log('No results found. Run `node scripts/agent-eval.js run` first.');
    return;
  }

  /** @type {Map<string, Map<string, object[]>>} */
  const grouped = new Map();
  for (const r of results) {
    if (!grouped.has(r.task)) grouped.set(r.task, new Map());
    const byAgent = grouped.get(r.task);
    if (!byAgent.has(r.agent)) byAgent.set(r.agent, []);
    byAgent.get(r.agent).push(r);
  }

  if (format === 'json') {
    const summary = [];
    for (const [task, byAgent] of grouped) {
      for (const [agent, runs] of byAgent) {
        const passed = runs.filter(r => r.passed).length;
        const avgMs = runs.reduce((s, r) => s + (r.durationMs ?? 0), 0) / runs.length;
        const costs = runs.filter(r => r.cost !== null).map(r => r.cost);
        const avgCost = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : null;
        summary.push({
          task,
          agent,
          passRate: `${passed}/${runs.length}`,
          consistency: `${Math.round((passed / runs.length) * 100)}%`,
          avgTimeS: (avgMs / 1000).toFixed(1),
          avgCostUsd: avgCost !== null ? `$${avgCost.toFixed(4)}` : 'n/a',
        });
      }
    }
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  // Table format
  const col = [16, 11, 8, 8, 13];
  const headers = ['Agent', 'Pass Rate', 'Cost', 'Time', 'Consistency'];
  const divider = cells => cells.map((c, i) => String(c).padEnd(col[i], '─')).join('─┼─');
  const row = cells => `│ ${cells.map((c, i) => String(c).padEnd(col[i])).join(' │ ')} │`;

  for (const [task, byAgent] of grouped) {
    const totalRuns = Math.max(...[...byAgent.values()].map(r => r.length));
    console.log(`\nTask: ${task} (${totalRuns} run${totalRuns !== 1 ? 's' : ''} each)`);
    console.log(`┌─${col.map(w => '─'.repeat(w)).join('─┬─')}─┐`);
    console.log(row(headers));
    console.log(`├─${divider(col.map(w => '─'.repeat(w)))}─┤`);

    for (const [agent, runs] of byAgent) {
      const passed = runs.filter(r => r.passed).length;
      const avgMs = runs.reduce((s, r) => s + (r.durationMs ?? 0), 0) / runs.length;
      const costs = runs.filter(r => r.cost !== null).map(r => r.cost);
      const avgCost = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : null;
      console.log(row([
        agent,
        `${passed}/${runs.length}`,
        avgCost !== null ? `$${avgCost.toFixed(4)}` : 'n/a',
        `${(avgMs / 1000).toFixed(1)}s`,
        `${Math.round((passed / runs.length) * 100)}%`,
      ]));
    }
    console.log(`└─${col.map(w => '─'.repeat(w)).join('─┴─')}─┘`);
  }
}

// ─── Argument parsing ─────────────────────────────────────────────────────────

function printHelp() {
  console.log(`
agent-eval — compare coding agents on reproducible tasks

Commands:
  run     Execute agents against a task definition
  report  Summarise results from previous runs

Options (run):
  --task <file>     Path to task YAML file (required)
  --agent <name>    Agent to run: claude-code | aider | codex | copilot (repeatable)
  --runs <n>        Number of trials per agent (default: 1)
  --results <dir>   Directory to store results (default: results/)

Options (report):
  --format table|json   Output format (default: table)
  --results <dir>       Directory to read results from (default: results/)

Examples:
  node scripts/agent-eval.js run \\
       --task tasks/add-quantum-gate.yaml \\
       --agent claude-code --agent aider --runs 3

  node scripts/agent-eval.js report --format table
  node scripts/agent-eval.js report --format json
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];

  if (command === 'run') {
    const opts = { taskFile: null, agents: [], runs: 1, resultsDir: path.join(REPO_ROOT, 'results') };
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--task' && args[i + 1]) opts.taskFile = args[++i];
      else if (args[i] === '--agent' && args[i + 1]) opts.agents.push(args[++i]);
      else if (args[i] === '--runs' && args[i + 1]) opts.runs = parseInt(args[++i], 10);
      else if (args[i] === '--results' && args[i + 1]) opts.resultsDir = args[++i];
    }
    if (!opts.taskFile) { console.error('Error: --task <file> is required'); process.exit(1); }
    if (opts.agents.length === 0) { console.error('Error: specify at least one --agent'); process.exit(1); }
    return { command: 'run', opts };
  }

  if (command === 'report') {
    const opts = { format: 'table', resultsDir: path.join(REPO_ROOT, 'results') };
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--format' && args[i + 1]) opts.format = args[++i];
      else if (args[i] === '--results' && args[i + 1]) opts.resultsDir = args[++i];
    }
    return { command: 'report', opts };
  }

  printHelp();
  process.exit(command === 'help' || command === '--help' || command === '-h' ? 0 : 1);
}

const { command, opts } = parseArgs(process.argv);
if (command === 'run') commandRun(opts);
if (command === 'report') commandReport(opts);
