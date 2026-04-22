import { motion } from 'framer-motion';
import {
  Brain,
  Play,
  Loader2,
  RefreshCw,
  Settings2,
  Cpu,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';

import {
  createModel,
  forwardPass,
  generateTokens,
  getMythosHealth,
  type ModelInfo,
  type MythosConfigInput,
} from '../services/mythosService';

// ─── Config Presets ──────────────────────────────────────────────────────────

const GQA_CONFIG: MythosConfigInput = {
  vocab_size: 1000,
  dim: 256,
  n_heads: 8,
  n_kv_heads: 2,
  max_seq_len: 128,
  max_loop_iters: 4,
  prelude_layers: 1,
  coda_layers: 1,
  n_experts: 8,
  n_shared_experts: 1,
  n_experts_per_tok: 2,
  expert_dim: 64,
  lora_rank: 8,
  attn_type: 'gqa',
};

const MLA_CONFIG: MythosConfigInput = {
  vocab_size: 1000,
  dim: 256,
  n_heads: 8,
  n_kv_heads: 8,
  max_seq_len: 128,
  max_loop_iters: 4,
  prelude_layers: 1,
  coda_layers: 1,
  n_experts: 8,
  n_shared_experts: 1,
  n_experts_per_tok: 2,
  expert_dim: 64,
  lora_rank: 8,
  attn_type: 'mla',
  kv_lora_rank: 32,
  q_lora_rank: 64,
  qk_rope_head_dim: 16,
  qk_nope_head_dim: 16,
  v_head_dim: 16,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoCard: React.FC<{
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}> = ({ label, value, color, icon }) => (
  <div className='bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4'>
    <div
      className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
      style={{ background: `${color}22` }}
    >
      <span style={{ color }}>{icon}</span>
    </div>
    <div className='min-w-0'>
      <p className='text-xs text-gray-400'>{label}</p>
      <p className='text-sm font-semibold text-white truncate'>{value}</p>
    </div>
  </div>
);

const MAX_LOG_ENTRIES = 50;

const OpenMythosDashboard: React.FC = () => {
  const [attnType, setAttnType] = useState<'gqa' | 'mla'>('gqa');
  const [nLoops, setNLoops] = useState(4);
  const [maxNewTokens, setMaxNewTokens] = useState(8);
  const [temperature, setTemperature] = useState(1.0);

  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [serviceOnline, setServiceOnline] = useState<boolean | null>(null);

  const [forwardShape, setForwardShape] = useState<number[] | null>(null);
  const [genShape, setGenShape] = useState<number[] | null>(null);
  const [spectralRadius, setSpectralRadius] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const MODEL_ID = `mythos-${attnType}`;
  const appendLog = (msg: string): void =>
    setLog(prev => [
      `[${new Date().toLocaleTimeString('ar-SA')}] ${msg}`,
      ...prev.slice(0, MAX_LOG_ENTRIES - 1),
    ]);

  // ── Health check ────────────────────────────────────────────────────────
  useEffect(() => {
    getMythosHealth()
      .then(() => setServiceOnline(true))
      .catch(() => setServiceOnline(false));
  }, []);

  // ── Create model ─────────────────────────────────────────────────────────
  const handleAttnTypeChange = useCallback((t: 'gqa' | 'mla') => {
    setAttnType(t);
    setModelInfo(null);
    setForwardShape(null);
    setGenShape(null);
  }, []);

  const handleCreate = useCallback(async (): Promise<void> => {
    setError(null);
    setIsCreating(true);
    setForwardShape(null);
    setGenShape(null);
    setSpectralRadius(null);
    try {
      const cfg = attnType === 'gqa' ? GQA_CONFIG : MLA_CONFIG;
      appendLog(`إنشاء نموذج ${attnType.toUpperCase()}...`);
      const info = await createModel(MODEL_ID, cfg);
      setModelInfo(info);
      setSpectralRadius(info.spectral_radius);
      appendLog(`✅ النموذج جاهز — ${info.total_parameters.toLocaleString('ar-SA')} معامل`);
      appendLog(`ρ(A) = ${info.spectral_radius.toFixed(4)} (يجب أن يكون < 1)`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'خطأ غير متوقع';
      setError(msg);
      appendLog(`❌ ${msg}`);
    } finally {
      setIsCreating(false);
    }
  }, [attnType, MODEL_ID]);

  // ── Forward pass ──────────────────────────────────────────────────────────
  const handleForward = useCallback(async (): Promise<void> => {
    if (!modelInfo) return;
    setError(null);
    setIsRunning(true);
    try {
      // Batch of 2 sequences, length 16
      const ids = Array.from({ length: 2 }, () =>
        Array.from({ length: 16 }, () => Math.floor(Math.random() * 1000))
      );
      appendLog(`تشغيل forward pass بـ ${nLoops} حلقات...`);
      const result = await forwardPass(MODEL_ID, ids, nLoops);
      setForwardShape(result.shape);
      appendLog(`✅ شكل logits: [${result.shape.join(', ')}]`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'خطأ غير متوقع';
      setError(msg);
      appendLog(`❌ ${msg}`);
    } finally {
      setIsRunning(false);
    }
  }, [modelInfo, MODEL_ID, nLoops]);

  // ── Generate ──────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async (): Promise<void> => {
    if (!modelInfo) return;
    setError(null);
    setIsGenerating(true);
    try {
      const ids = Array.from({ length: 2 }, () =>
        Array.from({ length: 16 }, () => Math.floor(Math.random() * 1000))
      );
      appendLog(`توليد ${maxNewTokens} رمز بـ ${nLoops} حلقات...`);
      const result = await generateTokens(MODEL_ID, ids, maxNewTokens, nLoops, temperature);
      setGenShape(result.shape);
      appendLog(`✅ شكل الإخراج: [${result.shape.join(', ')}]`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'خطأ غير متوقع';
      setError(msg);
      appendLog(`❌ ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  }, [modelInfo, MODEL_ID, nLoops, maxNewTokens, temperature]);

  const isBusy = isCreating || isRunning || isGenerating;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25'>
            <Brain className='w-5 h-5 text-white' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-white'>OpenMythos</h2>
            <p className='text-xs text-gray-400'>نموذج لغوي هجين: Transformer + Recurrent + MoE</p>
          </div>
        </div>
        <div className='flex items-center gap-2 text-xs'>
          {serviceOnline === null && <Loader2 className='w-4 h-4 animate-spin text-gray-400' />}
          {serviceOnline === true && (
            <span className='flex items-center gap-1 text-green-400'>
              <CheckCircle className='w-4 h-4' /> الخدمة متاحة
            </span>
          )}
          {serviceOnline === false && (
            <span className='flex items-center gap-1 text-red-400'>
              <AlertCircle className='w-4 h-4' /> الخدمة غير متاحة
            </span>
          )}
        </div>
      </div>

      {/* Config panel */}
      <div className='bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 space-y-4'>
        <div className='flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2'>
          <Settings2 className='w-4 h-4 text-violet-400' />
          إعداد النموذج
        </div>

        {/* Attention type */}
        <div className='flex gap-3'>
          {(['gqa', 'mla'] as const).map(t => (
            <button
              key={t}
              onClick={() => handleAttnTypeChange(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                attnType === t
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='text-xs text-gray-400 mb-1 block'>
              حلقات التكرار (n_loops): {nLoops}
            </label>
            <input
              type='range'
              min={1}
              max={8}
              step={1}
              value={nLoops}
              onChange={e => setNLoops(Number(e.target.value))}
              className='w-full accent-violet-500'
            />
          </div>
          <div>
            <label className='text-xs text-gray-400 mb-1 block'>رموز التوليد: {maxNewTokens}</label>
            <input
              type='range'
              min={1}
              max={64}
              step={1}
              value={maxNewTokens}
              onChange={e => setMaxNewTokens(Number(e.target.value))}
              className='w-full accent-fuchsia-500'
            />
          </div>
          <div>
            <label className='text-xs text-gray-400 mb-1 block'>
              الحرارة: {temperature.toFixed(2)}
            </label>
            <input
              type='range'
              min={0.1}
              max={2}
              step={0.05}
              value={temperature}
              onChange={e => setTemperature(Number(e.target.value))}
              className='w-full accent-pink-500'
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex flex-wrap gap-3 pt-1'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            disabled={isBusy}
            className='flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all'
          >
            {isCreating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Cpu className='w-4 h-4' />
            )}
            إنشاء النموذج
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleForward}
            disabled={isBusy || !modelInfo}
            className='flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all'
          >
            {isRunning ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Play className='w-4 h-4' />
            )}
            Forward Pass
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={isBusy || !modelInfo}
            className='flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all'
          >
            {isGenerating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Zap className='w-4 h-4' />
            )}
            توليد الرموز
          </motion.button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='flex items-center gap-3 bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-sm text-red-300'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          {error}
        </div>
      )}

      {/* Model info cards */}
      {modelInfo && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <InfoCard
            label='المعاملات'
            value={modelInfo.total_parameters.toLocaleString('ar-SA')}
            color='#a855f7'
            icon={<Brain className='w-5 h-5' />}
          />
          <InfoCard
            label='نوع الانتباه'
            value={attnType.toUpperCase()}
            color='#06b6d4'
            icon={<Activity className='w-5 h-5' />}
          />
          <InfoCard
            label='ρ(A) – الاستقرار'
            value={
              spectralRadius !== null
                ? `${spectralRadius.toFixed(4)} ${spectralRadius < 1 ? '✓' : '✗'}`
                : '—'
            }
            color={spectralRadius !== null && spectralRadius < 1 ? '#22c55e' : '#ef4444'}
            icon={<CheckCircle className='w-5 h-5' />}
          />
          <InfoCard
            label='حلقات التكرار'
            value={`${nLoops} / ${modelInfo.config['max_loop_iters'] as number}`}
            color='#f59e0b'
            icon={<RefreshCw className='w-5 h-5' />}
          />
        </div>
      )}

      {/* Results */}
      {(forwardShape ?? genShape) && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {forwardShape && (
            <div className='bg-blue-900/20 border border-blue-500/30 rounded-xl p-4'>
              <p className='text-xs text-blue-400 mb-1'>شكل Logits</p>
              <code className='text-white font-mono text-sm'>[{forwardShape.join(', ')}]</code>
              <p className='text-xs text-gray-500 mt-1'>
                [batch={forwardShape[0]}, seq={forwardShape[1]}, vocab={forwardShape[2]}]
              </p>
            </div>
          )}
          {genShape && (
            <div className='bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4'>
              <p className='text-xs text-emerald-400 mb-1'>شكل الإخراج المولّد</p>
              <code className='text-white font-mono text-sm'>[{genShape.join(', ')}]</code>
              <p className='text-xs text-gray-500 mt-1'>
                [batch={genShape[0]}, seq_total={genShape[1]}]
              </p>
            </div>
          )}
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className='bg-gray-900/70 border border-gray-700/50 rounded-xl p-4'>
          <p className='text-xs text-gray-500 mb-2 font-mono'>سجل العمليات</p>
          <div className='space-y-1 max-h-48 overflow-y-auto'>
            {log.map((entry, i) => (
              <p key={i} className='text-xs font-mono text-gray-300'>
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenMythosDashboard;
