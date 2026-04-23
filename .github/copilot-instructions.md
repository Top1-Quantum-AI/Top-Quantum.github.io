# Copilot Instructions for Top1 Quantum AI

## Project Overview

This is an **Advanced Quantum AI Hybrid System** — a full-stack web application combining quantum computing, artificial intelligence, and enterprise-grade security. The UI supports Arabic (RTL) as the primary language with multilingual capabilities (Arabic, English, French, Spanish).

## Technology Stack

### Frontend
- **React 18** with **TypeScript** (strict mode)
- **Vite** as the build tool
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js 20 LTS** with **Express.js** and **TypeScript**
- **MongoDB 7+** — primary database
- **Redis 7** — caching layer
- **NATS** — event streaming (JetStream)

### Quantum & AI
- **IBM Quantum / Qiskit** — quantum circuit simulation and hardware access
- **AWS Braket** — cloud quantum computing
- **OpenAI API** — LLM and AI agent integration

### Infrastructure
- **Docker** (multi-stage builds, multi-platform: amd64/arm64)
- **Kubernetes** with HPA auto-scaling
- **Nginx** as reverse proxy
- **GitHub Actions** for CI/CD (blue-green deployment to staging and production)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (frontend)
npm run dev

# Build for production
npm run build

# Run all tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Type-check
npm run type-check
```

## Code Style & Conventions

### TypeScript
- Strict mode is **required** — `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noPropertyAccessFromIndexSignature` are all enabled.
- Never use `any` — the ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`.
- Always provide explicit return types on functions and module boundaries.
- Prefer `??` (nullish coalescing) and `?.` (optional chaining) over `||` and manual null checks.
- Never use non-null assertion `!` — handle nullability explicitly.

### Formatting (Prettier)
- Single quotes (`'`) everywhere, including JSX (`jsxSingleQuote: true`).
- Trailing commas in ES5 positions (`trailingComma: "es5"`).
- Semicolons required (`semi: true`).
- Print width: **100 characters**.
- Tab width: **2 spaces** (no tabs).
- Arrow function parentheses omitted for single args (`arrowParens: "avoid"`).
- Line endings: **LF**.

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `style:` — formatting, no logic changes
- `refactor:` — code restructuring
- `test:` — adding or updating tests
- `chore:` — build, CI, dependency updates

### File & Component Conventions
- React components: **PascalCase** filenames and component names (e.g., `QuantumDashboard.tsx`).
- Services and utilities: **camelCase** filenames (e.g., `aiService.ts`, `database.ts`).
- Use named exports for utilities; default exports for React components.
- Keep components focused — extract sub-components when a file grows beyond ~300 lines.

## Architecture Guidelines

- **Frontend** lives in `src/` — components, styles, services.
- **Backend** lives in `server/` — routes, middleware, services, models.
- API routes follow the pattern `/api/v1/<resource>`.
- Health check endpoints: `/health` (liveness) and `/ready` (readiness).
- All async operations must be awaited; floating promises (`@typescript-eslint/no-floating-promises`) are a lint error.

## Security Requirements

This project has enterprise-grade security requirements:

- **Never** commit secrets, API keys, or credentials. Use environment variables.
- Post-quantum cryptography is used for sensitive data — do not downgrade to classical-only algorithms.
- All inputs must be validated and sanitized server-side.
- Use `bcryptjs` for password hashing; use JWT for authentication tokens.
- Security-related ESLint rules (`plugin:security/recommended`) are enforced — do not suppress them without justification.
- Container images are signed with Cosign and scanned with Trivy on every CI run.

## Testing

- **Jest** for unit and integration tests, located in `tests/`.
- Test files follow the pattern `*.test.ts` or `*.spec.ts`.
- Maintain or improve code coverage — do not submit changes that reduce coverage.
- Quantum simulator tests and AI/LLM tests are separate test suites.
- Use `npm test` to run the full test suite locally before pushing.

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs:
1. TypeScript compilation, ESLint, Prettier, and `npm audit`
2. Snyk and OWASP Dependency Check security scans
3. Unit, integration, quantum, security, and AI tests (parallelized)
4. Docker multi-platform build and push to GHCR
5. Trivy container vulnerability scan
6. Blue-green deployment to staging, then production on `main`

All checks must pass before merging to `main` or `develop`.

## Internationalization (i18n)

- The app defaults to **Arabic (RTL)** — use `dir="rtl"` and `space-x-reverse` Tailwind utilities where needed.
- String labels in Arabic UI code use Arabic text directly; keep this consistent.
- When adding new UI strings, ensure they have equivalents in all four supported languages: `ar`, `en`, `fr`, `es`.

## Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Apply these on every task.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that **your** changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Agent Evaluation (agent-eval)

Task definitions for benchmarking coding agents on this codebase live in `tasks/`.
Run comparisons with:

```bash
# Single task, multiple agents, 3 trials each
node scripts/agent-eval.js run --task tasks/add-quantum-gate.yaml --agent claude-code --agent aider --runs 3

# Generate comparison report
node scripts/agent-eval.js report --format table
```

See `tasks/` for available task definitions and `scripts/agent-eval.js` for the runner.
