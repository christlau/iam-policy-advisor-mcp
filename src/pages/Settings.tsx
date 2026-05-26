import { useSettings, type AppSettings } from '../services/useSettings'

export default function Settings() {
  const { settings, setSettings } = useSettings()
  const update = (patch: Partial<AppSettings>) => setSettings({ ...settings, ...patch })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">LLM Provider</label>
          <select value={settings.llmProvider} onChange={e => update({ llmProvider: e.target.value as AppSettings['llmProvider'] })}
            className="w-full border rounded px-3 py-2">
            <option value="openai">OpenAI</option>
            <option value="bedrock">AWS Bedrock</option>
            <option value="custom">Custom Endpoint</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input type="password" value={settings.apiKey} onChange={e => update({ apiKey: e.target.value })}
            className="w-full border rounded px-3 py-2" placeholder="sk-..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model Name</label>
          <input value={settings.modelName} onChange={e => update({ modelName: e.target.value })}
            className="w-full border rounded px-3 py-2" placeholder="gpt-4o-mini" />
        </div>
        {settings.llmProvider === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-1">Custom Endpoint URL</label>
            <input value={settings.customEndpoint || ''} onChange={e => update({ customEndpoint: e.target.value })}
              className="w-full border rounded px-3 py-2" placeholder="https://..." />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">MCP Server URL</label>
          <input value={settings.mcpServerUrl} onChange={e => update({ mcpServerUrl: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Local Proxy URL</label>
          <input value={settings.proxyUrl} onChange={e => update({ proxyUrl: e.target.value })}
            className="w-full border rounded px-3 py-2" />
        </div>
        <p className="text-green-600 text-sm">✓ Settings saved to localStorage automatically</p>
      </div>
    </div>
  )
}
