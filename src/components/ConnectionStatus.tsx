import { useState, useEffect } from 'react'
import { getSettings } from '../services/useSettings'

export default function ConnectionStatus() {
  const [mcpOk, setMcpOk] = useState<boolean | null>(null)
  const [proxyOk, setProxyOk] = useState<boolean | null>(null)

  useEffect(() => {
    const settings = getSettings()
    const check = async () => {
      try {
        const r = await fetch(`${settings.proxyUrl}/health`, { signal: AbortSignal.timeout(2000) })
        setProxyOk(r.ok)
      } catch { setProxyOk(false) }
      try {
        const r = await fetch(settings.mcpServerUrl, { method: 'POST', signal: AbortSignal.timeout(2000), headers: { 'Content-Type': 'application/json' }, body: '{}' })
        setMcpOk(r.status !== 0)
      } catch { setMcpOk(false) }
    }
    check()
    const i = setInterval(check, 15000)
    return () => clearInterval(i)
  }, [])

  const dot = (ok: boolean | null) => ok === null ? '⚪' : ok ? '🟢' : '🔴'

  return (
    <div className="flex gap-4 text-xs text-gray-600">
      <span>{dot(proxyOk)} Proxy</span>
      <span>{dot(mcpOk)} MCP Server</span>
    </div>
  )
}
