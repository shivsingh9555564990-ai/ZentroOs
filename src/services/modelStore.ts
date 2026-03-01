export interface FreeModel {
  id: string;
  name: string;
  contextLength: number;
  provider: string;
}

type Listener = () => void;

export interface ModelSnapshot {
  models: FreeModel[];
  selectedModelId: string;
  selectedModel: FreeModel | null;
  loading: boolean;
  error: string | null;
  count: number;
}

class ModelStore {
  models: FreeModel[] = [];
  selectedModelId: string = '';
  loading = false;
  error: string | null = null;
  private listeners: Set<Listener> = new Set();
  private lastFetch = 0;
  private _snapshot: ModelSnapshot | null = null;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private notify() {
    this._snapshot = null;
    this.listeners.forEach(fn => fn());
  }

  getSnapshot = (): ModelSnapshot => {
    if (!this._snapshot) {
      this._snapshot = {
        models: this.models,
        selectedModelId: this.selectedModelId,
        selectedModel: this.models.find(m => m.id === this.selectedModelId) || null,
        loading: this.loading,
        error: this.error,
        count: this.models.length,
      };
    }
    return this._snapshot;
  };

  setSelectedModel(id: string) {
    this.selectedModelId = id;
    try { localStorage.setItem('cos_model', id); } catch {}
    this.notify();
  }

  async fetchModels() {
    const now = Date.now();
    if (now - this.lastFetch < 20000 && this.models.length > 0) return;
    this.loading = true;
    this.notify();
    try {
      const res = await fetch('https://openrouter.ai/api/v1/models');
      if (!res.ok) throw new Error('API ' + res.status);
      const data = await res.json();
      const free: FreeModel[] = [];
      if (data?.data) {
        for (const m of data.data) {
          const p = m.pricing;
          const isFree = m.id?.includes(':free') ||
            (parseFloat(p?.prompt || '1') === 0 && parseFloat(p?.completion || '1') === 0);
          if (isFree) {
            free.push({
              id: m.id,
              name: (m.name || m.id).replace(/\s*\(free\)/gi, '').trim(),
              contextLength: m.context_length || 0,
              provider: m.id?.split('/')[0] || 'unknown',
            });
          }
        }
      }
      const pri: Record<string, number> = { google: 1, 'meta-llama': 2, mistralai: 3, qwen: 4, deepseek: 5, microsoft: 6 };
      free.sort((a, b) => (pri[a.provider] || 99) - (pri[b.provider] || 99) || b.contextLength - a.contextLength);
      this.models = free;
      this.error = null;
      this.lastFetch = now;
      if (!this.selectedModelId || !free.find(m => m.id === this.selectedModelId)) {
        const saved = (() => { try { return localStorage.getItem('cos_model'); } catch { return null; } })();
        this.selectedModelId = (saved && free.find(m => m.id === saved)) ? saved : (free[0]?.id || '');
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed';
    } finally {
      this.loading = false;
      this.notify();
    }
  }
}

export const modelStore = new ModelStore();
