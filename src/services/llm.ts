import { getSettings } from './useSettings'

const SYSTEM_PROMPT = "You are a code generator. Given a description of AWS activities, output ONLY valid AWS SDK code (no explanations, no markdown) that demonstrates those activities. Use the specified language's AWS SDK. Include all necessary imports."

export async function generateStubCode(activityDescription: string, language = 'python'): Promise<string> {
  const settings = getSettings()
  const prompt = `Language: ${language}\n\nActivity: ${activityDescription}`

  if (settings.llmProvider === 'bedrock') {
    return callBedrock(prompt, settings.modelName, settings.apiKey)
  }
  const endpoint = settings.llmProvider === 'custom' && settings.customEndpoint
    ? settings.customEndpoint
    : 'https://api.openai.com/v1'
  return callOpenAI(endpoint, settings.apiKey, settings.modelName, prompt)
}

async function callOpenAI(baseUrl: string, apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
  })
  if (!res.ok) throw new Error(`LLM error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content
}

async function callBedrock(prompt: string, modelId: string, _apiKey: string): Promise<string> {
  // Bedrock requires AWS Sig v4 — in browser context, use a proxy or pre-signed approach
  // For now, we call the local proxy which can forward to Bedrock
  const settings = getSettings()
  const res = await fetch(`${settings.proxyUrl}/bedrock-invoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId, system: SYSTEM_PROMPT, prompt }),
  })
  if (!res.ok) throw new Error(`Bedrock proxy error: ${res.status}`)
  const data = await res.json()
  return data.code
}
