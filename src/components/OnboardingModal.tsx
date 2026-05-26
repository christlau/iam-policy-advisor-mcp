import { useState } from 'react'

const DISMISSED_KEY = 'iam-policy-gen-onboarding-dismissed'

export default function OnboardingModal() {
  const [show, setShow] = useState(() => !localStorage.getItem(DISMISSED_KEY))

  if (!show) return null

  const dismiss = () => { localStorage.setItem(DISMISSED_KEY, '1'); setShow(false) }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
        <h2 className="text-xl font-bold">Welcome to IAM Policy Generator</h2>
        <p className="text-sm text-gray-600">This tool helps you generate least-privilege IAM policies from your code or activity descriptions.</p>
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm space-y-2">
          <p className="font-semibold">Before you start:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Attach <code className="bg-blue-100 px-1 rounded">SignInLocalDevelopmentAccess</code> to your IAM user/role</li>
            <li>Run <code className="bg-blue-100 px-1 rounded">aws login</code></li>
            <li>Start the MCP server: <code className="bg-blue-100 px-1 rounded">iam-policy-autopilot --transport http</code></li>
            <li>Start the local proxy: <code className="bg-blue-100 px-1 rounded">npm run proxy</code></li>
            <li>Configure your LLM provider in Settings</li>
          </ol>
        </div>
        <button onClick={dismiss} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Got it</button>
      </div>
    </div>
  )
}
