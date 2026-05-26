import { useState, useCallback } from 'react'

export interface AppSettings {
  llmProvider: 'bedrock' | 'openai' | 'custom'
  apiKey: string
  modelName: string
  mcpServerUrl: string
  proxyUrl: string
  customEndpoint?: string
}

const STORAGE_KEY = 'iam-policy-gen-settings'

const defaults: AppSettings = {
  llmProvider: 'openai',
  apiKey: '',
  modelName: 'gpt-4o-mini',
  mcpServerUrl: 'http://localhost:8001/mcp',
  proxyUrl: 'http://localhost:8002',
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults
    } catch { return defaults }
  })

  const setSettings = useCallback((s: AppSettings) => {
    setSettingsState(s)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  }, [])

  return { settings, setSettings }
}

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults
  } catch { return defaults }
}
