import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu, RefreshCw, Check, X } from 'lucide-react';
import { modelStore } from '../services/modelStore';

export default function ModelSelector() {
  const state = useSyncExternalStore(modelStore.subscribe, modelStore.getSnapshot);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { modelStore.fetchModels(); }, []);

  const filtered = search.trim()
    ? state.models.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase()))
    : state.models;

  const fmtCtx = (n: number) => n >= 1000000 ? `${(n/1e6).toFixed(0)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : `${n}`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.32 }} className="mb-5">
      <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOpen(!open)}
        className="w-full rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5"
        style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(20px)',
          border: open ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
        <Cpu size={13} className="text-cyan-400 flex-shrink-0" />
        {state.loading && state.models.length === 0 ? (
          <span className="text-[12px] text-gray-500 font-medium flex-1 text-left">Loading models...</span>
        ) : state.selectedModel ? (
          <span className="text-[12px] text-white font-semibold flex-1 text-left truncate">{state.selectedModel.name}</span>
        ) : (
          <span className="text-[12px] text-gray-500 font-medium flex-1 text-left">Select AI Model</span>
        )}
        {state.count > 0 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {state.count} free
          </span>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(17,24,39,0.85)', backdropFilter: 'blur(30px)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <div className="p-2.5 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    className="flex-1 bg-transparent border-none outline-none text-[12px] text-white placeholder-gray-600 font-medium" />
                  {search && <button onClick={() => setSearch('')}><X size={12} className="text-gray-500" /></button>}
                </div>
                <motion.button whileTap={{ scale: 0.85, rotate: 180 }} onClick={() => modelStore.fetchModels()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <RefreshCw size={12} className={`text-gray-400 ${state.loading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
              <div className="max-h-[250px] overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'none' }}>
                {filtered.length === 0 ? (
                  <div className="py-6 text-center"><p className="text-[11px] text-gray-500">No models found</p></div>
                ) : filtered.map(model => {
                  const sel = model.id === state.selectedModelId;
                  return (
                    <button key={model.id}
                      onClick={() => { modelStore.setSelectedModel(model.id); setOpen(false); setSearch(''); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left mb-0.5"
                      style={{ background: sel ? 'rgba(6,182,212,0.08)' : 'transparent',
                        border: sel ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sel ? '#06B6D4' : 'rgba(255,255,255,0.1)' }} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-semibold truncate ${sel ? 'text-white' : 'text-gray-400'}`}>{model.name}</p>
                        <p className="text-[9px] text-gray-600 mt-0.5">{model.provider} {model.contextLength > 0 && `· ${fmtCtx(model.contextLength)}`}</p>
                      </div>
                      {sel && <Check size={12} className="text-cyan-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
                }
