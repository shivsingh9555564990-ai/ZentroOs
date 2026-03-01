import { useState, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Check, RotateCcw, Zap, Cpu } from 'lucide-react';
import { getToolById } from '../tools/toolConfig';
import { generateAIContent } from '../services/aiService';
import { modelStore } from '../services/modelStore';
import LoadingShimmer from '../components/LoadingShimmer';
import FormattedResult from '../components/FormattedResult';
import { showToast } from '../components/Toast';

function useModelStore() { return useSyncExternalStore(modelStore.subscribe, modelStore.getSnapshot); }

export default function ToolPage() {
  const { platform, toolId } = useParams<{ platform: string; toolId: string }>();
  const navigate = useNavigate();
  const tool = getToolById(platform || '', toolId || '');
  const { selectedModel } = useModelStore();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [usedModel, setUsedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [genTime, setGenTime] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  if (!tool) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0B0F1A' }}>
        <div className="text-center">
          <p className="text-white text-lg font-bold mb-2">Tool not found</p>
          <button onClick={() => navigate('/')} className="text-accent-instagram text-sm font-medium">← Go Home</button>
        </div>
      </div>
    );
  }

  const isYoutube = tool.platform === 'youtube';
  const accent = tool.accentColor;
  const glow = tool.glowColor;

  const handleGenerate = async () => {
    if (!input.trim() || input.trim().length < 3) { showToast('Please enter at least 3 characters', 'error'); return; }
    setLoading(true); setResult(''); setUsedModel(''); setCopied(false);
    const start = Date.now();
    try {
      const res = await generateAIContent({ toolType: `${tool.platform}_${tool.id}`, userInput: input.trim(), systemPrompt: tool.systemPrompt, maxTokens: tool.maxTokens });
      const elapsed = (Date.now() - start) / 1000;
      setGenTime(elapsed);
      if (res.success) {
        setResult(res.result); setUsedModel(res.model || '');
        showToast(`Generated in ${elapsed.toFixed(1)}s ✨`, 'success');
        setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 200);
      } else { showToast(res.error || 'Generation failed.', 'error'); }
    } catch { showToast('Network error.', 'error'); }
    finally { setLoading(false); }
  };

  const handleCopy = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(result); setCopied(true); showToast('Copied! ✅', 'success'); setTimeout(() => setCopied(false), 2000);
    } catch { showToast('Copy failed', 'error'); }
  };

  const handleReset = () => { setInput(''); setResult(''); setUsedModel(''); setCopied(false); setCharCount(0); setGenTime(0); };
  const handleInputChange = (v: string) => { if (v.length <= 2000) { setInput(v); setCharCount(v.length); } };
  const cleanModel = (m: string) => { const p = m.split('/'); return p.length > 1 ? p[1].replace(':free', '') : m; };

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}
      initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0.5 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full glow-pulse"
          style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, top: '-15%', right: '-10%' }} />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="px-5 safe-area-top">
          <div className="flex items-center gap-3 pt-4 pb-4">
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(isYoutube ? '/youtube' : '/instagram')}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
              <ArrowLeft size={18} className="text-white" />
            </motion.button>
            <div className="flex-1 min-w-0">
              <h1 className="text-[16px] font-bold text-white tracking-tight truncate">{tool.name}</h1>
              <p className="text-[11px] text-text-secondary mt-0.5 truncate">{tool.description}</p>
            </div>
            {result && (
              <motion.button whileTap={{ scale: 0.88 }} onClick={handleReset}
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <RotateCcw size={15} className="text-text-secondary" />
              </motion.button>
            )}
          </div>

          <div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />

          {selectedModel && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}>
              <Cpu size={12} className="text-cyan-400 flex-shrink-0" />
              <span className="text-[11px] text-cyan-400 font-medium truncate">Model: {selectedModel.name}</span>
              <span className="text-[9px] text-text-secondary ml-auto flex-shrink-0">Free</span>
            </motion.div>
          )}

          <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-[20px] overflow-hidden"
              style={{ background: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${loading ? accent + '40' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: loading ? `0 0 40px -10px ${glow}` : 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}>
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                <Zap size={14} style={{ color: accent }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>Your Topic</span>
                <div className="flex-1" />
                <span className="text-[10px] text-text-secondary tabular-nums">{charCount}/2000</span>
              </div>
              <div className="px-4 pb-2">
                <textarea value={input} onChange={e => handleInputChange(e.target.value)} placeholder={tool.placeholder} disabled={loading} rows={4}
                  className="w-full bg-transparent border-none outline-none resize-none text-[14px] text-white placeholder-gray-600 leading-relaxed font-medium"
                  style={{ opacity: loading ? 0.5 : 1, minHeight: '100px', caretColor: accent }} />
              </div>
              <div className="px-4 pb-4">
                <motion.button whileTap={{ scale: loading ? 1 : 0.97 }} onClick={handleGenerate} disabled={loading || !input.trim()}
                  className="w-full py-3.5 rounded-2xl font-bold text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                  style={{ background: isYoutube ? 'linear-gradient(135deg, #FF3B30, #FF6B35)' : 'linear-gradient(135deg, #A855F7, #EC4899)',
                    boxShadow: loading ? 'none' : `0 8px 32px -8px ${accent}66` }}>
                  {loading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 rounded-full border-2 border-transparent border-t-white border-r-white/40" /><span>Generating...</span></>
                  ) : (<><Sparkles size={16} /><span>Generate with AI</span></>)}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-[20px] p-5 mb-4"
                style={{ background: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <LoadingShimmer accentColor={accent} />
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                  <span className="text-[11px] text-text-secondary font-medium">Analyzing trends...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && !loading && (
              <motion.div ref={resultRef} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }} className="rounded-[20px] overflow-hidden mb-6"
                style={{ background: 'rgba(17, 24, 39, 0.55)', backdropFilter: 'blur(24px)',
                  border: `1px solid ${accent}30`, boxShadow: `0 0 60px -15px ${glow}` }}>
                <div className="px-5 pt-4 pb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>✨ AI Result</span>
                  <div className="flex-1" />
                  <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
                    style={{ background: copied ? 'rgba(16,185,129,0.15)' : `${accent}15`,
                      border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : accent + '25'}`, color: copied ? '#10B981' : accent }}>
                    {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied!' : 'Copy All'}
                  </motion.button>
                </div>
                <div className="h-px mx-5" style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
                <div className="px-5 py-4 max-h-[60vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <FormattedResult text={result} accentColor={accent} />
                </div>
                <div className="px-5 py-3 flex items-center gap-3 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-text-secondary font-medium">AI Generated</span>
                  </div>
                  {usedModel && (
                    <div className="flex items-center gap-1.5">
                      <Cpu size={9} className="text-cyan-400" />
                      <span className="text-[10px] text-cyan-400 font-medium">{cleanModel(usedModel)}</span>
                    </div>
                  )}
                  <div className="flex-1" />
                  {genTime > 0 && <span className="text-[10px] text-text-secondary font-medium">⚡ {genTime.toFixed(1)}s</span>}
                  <span className="text-[10px] text-text-secondary font-medium">{result.length} chars</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-20 safe-area-bottom" />
        </div>
      </div>
    </motion.div>
  );
          }
