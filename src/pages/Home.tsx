import { useState } from 'react'
import { generateStubCode } from '../services/llm'
import { connect, generatePolicies } from '../services/mcp-client'
import { getSettings } from '../services/useSettings'
import Results from '../components/Results'

type Mode = 'describe' | 'code'

export default function Home() {
  const [mode, setMode] = useState<Mode>('describe')
  const [activity, setActivity] = useState('')
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [filePath, setFilePath] = useState('')
  const [serviceHints, setServiceHints] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<unknown>(null)

  const reset = () => { setResult(null); setError('') }

  const handleDescribe = async () => {
    setLoading(true); setError('')
    try {
      const settings = getSettings()
      const stub = await generateStubCode(activity, language)
      const res = await fetch(`${settings.proxyUrl}/write-stub`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: stub, language }),
      })
      const { filePath: fp } = await res.json()
      await connect(settings.mcpServerUrl)
      const policy = await generatePolicies([fp], undefined, undefined, serviceHints ? serviceHints.split(',').map(s => s.trim()) : undefined)
      setResult(policy)
    } catch (e: unknown) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  const handleCode = async () => {
    setLoading(true); setError('')
    try {
      const settings = getSettings()
      let fp = filePath.trim()
      if (!fp && code.trim()) {
        const res = await fetch(`${settings.proxyUrl}/write-stub`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        })
        const data = await res.json()
        fp = data.filePath
      }
      if (!fp) throw new Error('Provide code or a file path')
      await connect(settings.mcpServerUrl)
      const policy = await generatePolicies([fp], undefined, undefined, serviceHints ? serviceHints.split(',').map(s => s.trim()) : undefined)
      setResult(policy)
    } catch (e: unknown) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  if (result) return <Results result={result} onReset={() => { reset(); setResult(null) }} />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generate IAM Policy</h1>
      <div className="flex gap-2">
        <button onClick={() => setMode('describe')} className={`px-4 py-2 rounded ${mode === 'describe' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Describe Activity
        </button>
        <button onClick={() => setMode('code')} className={`px-4 py-2 rounded ${mode === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Paste Code / Provide Path
        </button>
      </div>

      {mode === 'describe' && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <textarea value={activity} onChange={e => setActivity(e.target.value)} rows={5}
            className="w-full border rounded px-3 py-2" placeholder="Describe what AWS actions you need (e.g., 'Read from S3 bucket, write to DynamoDB table')" />
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-3 py-2">
                {['python', 'typescript', 'javascript', 'go', 'java'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Service Hints (optional, comma-separated)</label>
              <input value={serviceHints} onChange={e => setServiceHints(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="s3, dynamodb" />
            </div>
          </div>
          <button onClick={handleDescribe} disabled={loading || !activity.trim()} className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Policy'}
          </button>
        </div>
      )}

      {mode === 'code' && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-1">File Path (absolute path on your machine)</label>
            <input value={filePath} onChange={e => setFilePath(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="/home/user/project/app.py" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Or paste code directly</label>
            <textarea value={code} onChange={e => setCode(e.target.value)} rows={8}
              className="w-full border rounded px-3 py-2 font-mono text-sm" placeholder="import boto3..." />
          </div>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-3 py-2">
                {['python', 'typescript', 'javascript', 'go', 'java'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Service Hints (optional)</label>
              <input value={serviceHints} onChange={e => setServiceHints(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="s3, lambda" />
            </div>
          </div>
          <button onClick={handleCode} disabled={loading || (!code.trim() && !filePath.trim())} className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">{error}</div>}
    </div>
  )
}
