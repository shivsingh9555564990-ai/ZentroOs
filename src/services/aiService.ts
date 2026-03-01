import { modelStore } from './modelStore';

const API_ENDPOINT = '/api/generate';

interface AIRequest {
  toolType: string;
  userInput: string;
  systemPrompt: string;
  maxTokens?: number;
}

interface AIResponse {
  success: boolean;
  result: string;
  model?: string;
  error?: string;
}

async function callBackend(
  modelId: string,
  systemPrompt: string,
  userInput: string,
  maxTokens: number,
  temp: number,
  timeoutMs: number
): Promise<{ content: string; model: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
        max_tokens: maxTokens,
        temperature: temp,
      }),
      signal: ctrl.signal,
    });

    clearTimeout(timer);
    const data = await res.json();

    if (!res.ok || data.error) {
      const errMsg = data.error || `Server error ${res.status}`;

      if (res.status === 401) {
        throw new Error('INVALID_KEY: Server API key is invalid. Contact admin.');
      }
      if (res.status === 429) {
        throw new Error('RATE_LIMIT: Model is rate limited. Wait a few seconds or select different model.');
      }
      if (res.status === 402) {
        throw new Error('NOT_FREE: This model requires credits. Select a free model.');
      }
      if (res.status === 404) {
        throw new Error('NOT_FOUND: This model no longer exists. Select a different model.');
      }
      if (res.status === 503) {
        throw new Error('OFFLINE: This model is currently offline. Select a different model.');
      }
      if (res.status === 500 && typeof errMsg === 'string' && errMsg.includes('API key not configured')) {
        throw new Error('CONFIG: Server API key not set up. Contact admin.');
      }

      throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    }

    if (!data.result?.trim()) {
      throw new Error('Model returned empty response. Try again.');
    }

    return { content: data.result.trim(), model: data.model || modelId };
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('TIMEOUT: Model took too long. Try again or select a faster model.');
    }
    throw e;
  }
}

export async function generateAIContent(req: AIRequest): Promise<AIResponse> {
  const maxTokens = req.maxTokens || 1000;

  // Load models if empty
  if (modelStore.models.length === 0) {
    try { await modelStore.fetchModels(); } catch {}
  }

  const selectedId = modelStore.selectedModelId;
  const selectedModel = modelStore.models.find(m => m.id === selectedId);

  if (!selectedId || !selectedModel) {
    return {
      success: false,
      result: '',
      error: 'No model selected. Please select an AI model from the model selector on the home screen.',
    };
  }

  const modelName = selectedModel.name;

  // ATTEMPT 1: Normal request (20s timeout)
  try {
    const result = await callBackend(selectedId, req.systemPrompt, req.userInput, maxTokens, 0.8, 20000);
    return { success: true, result: result.content, model: result.model };
  } catch (e1) {
    const err1 = e1 instanceof Error ? e1.message : String(e1);

    // Don't retry for permanent errors
    if (err1.includes('INVALID_KEY') || err1.includes('CONFIG') || err1.includes('NOT_FREE') || err1.includes('NOT_FOUND')) {
      const cleanErr = err1.includes(':') ? err1.split(': ').slice(1).join(': ') : err1;
      return {
        success: false, result: '',
        error: `❌ "${modelName}" — ${cleanErr}\n\nPlease select a different model.`,
        model: selectedId,
      };
    }

    // ATTEMPT 2: Lower temperature (20s timeout)
    try {
      const result = await callBackend(selectedId, req.systemPrompt, req.userInput, maxTokens, 0.5, 20000);
      return { success: true, result: result.content, model: result.model };
    } catch (e2) {
      const err2 = e2 instanceof Error ? e2.message : String(e2);

      // ATTEMPT 3: Minimal settings (30s timeout)
      try {
        const result = await callBackend(selectedId, req.systemPrompt, req.userInput, Math.min(maxTokens, 500), 0.3, 30000);
        return { success: true, result: result.content, model: result.model };
      } catch (e3) {
        const err3 = e3 instanceof Error ? e3.message : String(e3);
        const cleanError = (err3.includes(':') ? err3.split(': ').slice(1).join(': ') : err3) || err2 || err1;

        return {
          success: false, result: '',
          error: `⚠️ "${modelName}" failed after 3 attempts.\n\n${cleanError}\n\n💡 Try selecting a different model from the home screen.`,
          model: selectedId,
        };
      }
    }
  }
}
