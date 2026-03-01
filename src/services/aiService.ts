const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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';

const RACE_MODELS = [
  'openrouter/auto',
  'arcee-ai/trinity-large-preview:free',
  'stepfun/step-3.5-flash:free',
];

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

async function callModel(
  model: string, systemPrompt: string, userInput: string,
  maxTokens: number, temp: number, timeoutMs: number
): Promise<{ content: string; model: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://creatoros.app',
        'X-Title': 'CreatorOS',
      },
      body: JSON.stringify({
        model,
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Model error');
    const content = data.choices?.[0]?.message?.content;
    if (!content?.trim()) throw new Error('Empty response');
    return { content: content.trim(), model: data.model || model };
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function raceModels(
  models: string[], systemPrompt: string, userInput: string,
  maxTokens: number, temp: number, timeoutMs: number
): Promise<{ content: string; model: string } | null> {
  try {
    return await Promise.any(
      models.map(m => callModel(m, systemPrompt, userInput, maxTokens, temp, timeoutMs))
    );
  } catch { return null; }
}

export async function generateAIContent(req: AIRequest): Promise<AIResponse> {
  const maxTokens = req.maxTokens || 1000;
  try {
    const r1 = await raceModels(RACE_MODELS, req.systemPrompt, req.userInput, maxTokens, 0.8, 12000);
    if (r1) return { success: true, result: r1.content, model: r1.model };
    const r2 = await raceModels(RACE_MODELS, req.systemPrompt, req.userInput, maxTokens, 0.5, 18000);
    if (r2) return { success: true, result: r2.content, model: r2.model };
    return { success: false, result: '', error: 'All models are busy. Please try again.' };
  } catch (e) {
    return { success: false, result: '', error: e instanceof Error ? e.message : 'Something went wrong.' };
  }
}
