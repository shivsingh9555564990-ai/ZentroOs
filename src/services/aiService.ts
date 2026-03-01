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
      error: '⚠️ No model selected.\n\nPlease select an AI model from the model selector on the home screen.',
    };
  }

  const modelName = selectedModel.name;

  // Single attempt — if model fails, user should switch model
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedId,
        messages: [
          { role: 'system', content: req.systemPrompt },
          { role: 'user', content: req.userInput },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: ctrl.signal,
    });

    clearTimeout(timer);

    const data = await res.json();

    // Success
    if (res.ok && data.success && data.result) {
      return {
        success: true,
        result: data.result,
        model: data.model || selectedId,
      };
    }

    // Error from server
    const errMsg = data.error || `Server error ${res.status}`;
    const debugInfo = data.debug ? `\n\nDebug: ${data.debug}` : '';

    // Specific error guidance
    if (res.status === 401) {
      return {
        success: false, result: '',
        error: '🔑 API key is invalid or expired.\n\nUpdate OPENROUTER_API_KEY in Vercel → Settings → Environment Variables → Redeploy.',
      };
    }

    if (res.status === 429) {
      return {
        success: false, result: '',
        error: `⏳ "${modelName}" is rate limited right now.\n\nWait 10 seconds and try again, or select a different model.`,
      };
    }

    if (res.status === 402) {
      return {
        success: false, result: '',
        error: `💳 "${modelName}" is not free anymore.\n\nPlease select a different free model from the home screen.`,
      };
    }

    if (res.status === 404) {
      return {
        success: false, result: '',
        error: `❌ "${modelName}" no longer exists on OpenRouter.\n\nPlease select a different model. Tap refresh in model selector to update the list.`,
      };
    }

    if (res.status === 502) {
      return {
        success: false, result: '',
        error: `🔇 "${modelName}" returned empty response. This model may not work properly.\n\nPlease select a different model.${debugInfo}`,
      };
    }

    if (res.status === 500 && errMsg.includes('OPENROUTER_API_KEY')) {
      return {
        success: false, result: '',
        error: '⚙️ Server not configured.\n\nSet OPENROUTER_API_KEY in Vercel → Settings → Environment Variables → Redeploy.',
      };
    }

    return {
      success: false, result: '',
      error: `⚠️ "${modelName}" error:\n\n${errMsg}${debugInfo}\n\n💡 Try selecting a different model.`,
    };

  } catch (e) {
    clearTimeout(timer);

    if (e instanceof DOMException && e.name === 'AbortError') {
      return {
        success: false, result: '',
        error: `⏱️ "${modelName}" took too long (30s timeout).\n\nThis model might be overloaded. Select a faster model.`,
      };
    }

    const errMsg = e instanceof Error ? e.message : 'Unknown error';

    // Check if it's a network/fetch error (serverless function not found)
    if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError') || errMsg.includes('fetch')) {
      return {
        success: false, result: '',
        error: '🌐 Cannot reach server.\n\nPossible reasons:\n• App not deployed on Vercel\n• /api/generate endpoint not found\n• Network connection issue\n\nMake sure api/generate.ts exists in your repo and app is deployed on Vercel.',
      };
    }

    return {
      success: false, result: '',
      error: `❌ Error: ${errMsg}\n\n💡 Try a different model or check your connection.`,
    };
  }
}
