import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, User, Mail, Calendar, Shield, ChevronRight, Sparkles, Pencil, Check, X, Bell, Moon, Vibrate, Save, Minimize2, Globe } from 'lucide-react';
import { authService } from '../services/auth';
import type { User as UserType, AppSettings } from '../services/auth';

interface ProfileScreenProps { user: UserType; onLogout: () => void; }

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Portuguese', 'Arabic'];

export default function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [settings, setSettings] = useState<AppSettings>(authService.getSettings());
  const [showLang, setShowLang] = useState(false);
  const [stats] = useState(authService.getStats());
  const [displayUser, setDisplayUser] = useState(user);

  useEffect(() => { authService.saveSettings(settings); }, [settings]);

  const initials = displayUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = new Date(displayUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isGoogle = displayUser.avatar ? true : false;

  const handleSaveName = async () => {
    if (newName.trim().length >= 2) {
      const ok = await authService.updateName(newName.trim());
      if (ok) { setDisplayUser(prev => ({ ...prev, name: newName.trim() })); }
    }
    setEditingName(false);
  };

  const toggle = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => { await onLogout(); };

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}
      initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0.5 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', top: '-15%', right: '-10%' }} />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="px-6 safe-area-top">
          <div className="flex items-center gap-4 pt-4 pb-5">
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate('/')}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <ArrowLeft size={18} className="text-white" />
            </motion.button>
            <h1 className="text-lg font-bold text-white tracking-tight flex-1">Profile</h1>
            {isGoogle && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                style={{ background: 'rgba(66,133,244,0.1)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.2)' }}>Google</span>
            )}
          </div>

          <div className="h-px w-full mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25), transparent)' }} />

          <motion.div className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)', boxShadow: '0 0 40px -8px rgba(168,85,247,0.5)' }}>
              {displayUser.avatar ? (
                <img src={displayUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xl font-bold">{initials}</span>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: '#10B981', border: '2.5px solid #0B0F1A' }}>
                <Sparkles size={10} className="text-white" />
              </div>
            </div>

            {editingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} autoFocus
                  className="bg-transparent border-b-2 border-purple-500 text-white text-center text-lg font-bold outline-none px-2 py-1 w-48"
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()} />
                <button onClick={handleSaveName}><Check size={18} className="text-emerald-400" /></button>
                <button onClick={() => { setEditingName(false); setNewName(displayUser.name); }}><X size={18} className="text-red-400" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-lg font-bold text-white">{displayUser.name}</h2>
                <button onClick={() => setEditingName(true)}><Pencil size={13} className="text-text-secondary" /></button>
              </div>
            )}
            <p className="text-sm text-text-secondary mt-0.5">{displayUser.email}</p>
          </motion.div>

          <motion.div className="space-y-2.5 mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <InfoRow icon={<User size={15} />} label="Name" value={displayUser.name} />
            <InfoRow icon={<Mail size={15} />} label="Email" value={displayUser.email} />
            <InfoRow icon={<Calendar size={15} />} label="Member Since" value={memberSince} />
            <InfoRow icon={<Shield size={15} />} label="Plan" value="Free" badge="Upgrade" />
          </motion.div>

          <motion.div className="mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest mb-3 px-1">Usage Stats</p>
            <div className="rounded-[20px] p-4 space-y-3"
              style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{stats.totalGenerations}</p>
                  <p className="text-[10px] text-text-secondary">Generations</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{stats.toolsUsed}</p>
                  <p className="text-[10px] text-text-secondary">Tools</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{stats.savedResults}</p>
                  <p className="text-[10px] text-text-secondary">Saved</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <UsageBar label="YouTube" pct={65} color="#FF3B30" />
                <UsageBar label="Instagram" pct={35} color="#A855F7" />
                <UsageBar label="API Quota" pct={12} color="#10B981" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest mb-3 px-1">Settings</p>
            <div className="rounded-[20px] overflow-hidden"
              style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <ToggleRow icon={<Bell size={15} />} label="Notifications" subtitle="Get AI updates" on={settings.notifications}
                onToggle={() => toggle('notifications')} color="#A855F7" />
              <Sep />
              <ToggleRow icon={<Moon size={15} />} label="Dark Mode" subtitle="Always on" on={settings.darkMode}
                onToggle={() => toggle('darkMode')} color="#6366F1" />
              <Sep />
              <ToggleRow icon={<Vibrate size={15} />} label="Haptic Feedback" subtitle="Vibration on tap" on={settings.hapticFeedback}
                onToggle={() => toggle('hapticFeedback')} color="#EC4899" />
              <Sep />
              <ToggleRow icon={<Save size={15} />} label="Auto Save" subtitle="Save results automatically" on={settings.autoSave}
                onToggle={() => toggle('autoSave')} color="#10B981" />
              <Sep />
              <ToggleRow icon={<Minimize2 size={15} />} label="Compact Mode" subtitle="Smaller UI elements" on={settings.compactMode}
                onToggle={() => toggle('compactMode')} color="#06B6D4" />
              <Sep />
              <button onClick={() => setShowLang(!showLang)} className="w-full px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <Globe size={15} className="text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] text-white font-medium">Language</p>
                  <p className="text-[11px] text-text-secondary">{settings.language}</p>
                </div>
                <motion.div animate={{ rotate: showLang ? 90 : 0 }}><ChevronRight size={14} className="text-text-secondary" /></motion.div>
              </button>
              <AnimatePresence>
                {showLang && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                      {LANGUAGES.map(lang => (
                        <button key={lang} onClick={() => setSettings(s => ({ ...s, language: lang }))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                          style={{
                            background: settings.language === lang ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${settings.language === lang ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                            color: settings.language === lang ? '#F59E0B' : '#9CA3AF',
                          }}>
                          {settings.language === lang && <Check size={10} />}{lang}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div className="mt-6 mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            {!showLogout ? (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowLogout(true)}
                className="w-full py-4 rounded-2xl font-bold text-[14px] text-red-400 flex items-center justify-center gap-2.5"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <LogOut size={16} /><span>Sign Out</span>
              </motion.button>
            ) : (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p className="text-sm text-white font-semibold mb-1">Sign out?</p>
                <p className="text-xs text-text-secondary mb-4">You'll need to sign in again to access your tools.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogout(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-text-secondary"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleLogout}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>Sign Out</motion.button>
                </div>
              </div>
            )}
          </motion.div>

          <div className="text-center mb-6">
            <p className="text-[11px] text-text-secondary/40">CreatorOS v1.0 • Built with ⚡</p>
          </div>
          <div className="h-20 safe-area-bottom" />
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, label, value, badge }: { icon: React.ReactNode; label: string; value: string; badge?: string }) {
  return (
    <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)' }}>
        <span className="text-purple-400">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-secondary font-medium">{label}</p>
        <p className="text-[13px] text-white font-semibold truncate">{value}</p>
      </div>
      {badge && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))', color: '#A855F7', border: '1px solid rgba(168,85,247,0.2)' }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function ToggleRow({ icon, label, subtitle, on, onToggle, color }: { icon: React.ReactNode; label: string; subtitle: string; on: boolean; onToggle: () => void; color: string }) {
  return (
    <button onClick={onToggle} className="w-full px-4 py-3.5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="text-[13px] text-white font-medium">{label}</p>
        <p className="text-[11px] text-text-secondary">{subtitle}</p>
      </div>
      <motion.div className="w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer"
        style={{ background: on ? color : 'rgba(255,255,255,0.1)' }} animate={{ background: on ? color : 'rgba(255,255,255,0.1)' }}>
        <motion.div className="w-5 h-5 rounded-full bg-white shadow-md"
          animate={{ x: on ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </motion.div>
    </button>
  );
}

function Sep() { return <div className="h-px mx-4" style={{ background: 'rgba(255,255,255,0.04)' }} />; }

function UsageBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-text-secondary font-medium">{label}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
      </div>
    </div>
  );
}
