export const config = {
  runtime: 'edge',
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set OPENROUTER_API_KEY in Vercel environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { model, messages, max_tokens, temperature } = body;

    if (!model || !messages) {
      return new Response(
        JSON.stringify({ error: 'Missing model or messages' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zentroos.app',
        'X-Title': 'ZentroOS',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: max_tokens || 1000,
        temperature: temperature ?? 0.8,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || `OpenRouter error ${response.status}`;
      return new Response(
        JSON.stringify({ error: errMsg, status: response.status }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (data.error) {
      return new Response(
        JSON.stringify({ error: data.error.message || 'Model error' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Model returned empty response' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: content.trim(),
        model: data.model || model,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
