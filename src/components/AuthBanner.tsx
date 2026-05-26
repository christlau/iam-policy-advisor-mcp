import { useState } from 'react'

export default function AuthBanner() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-amber-800">
          ⚠️ Requires <code className="bg-amber-100 px-1 rounded">aws login</code> with <code className="bg-amber-100 px-1 rounded">SignInLocalDevelopmentAccess</code> policy
        </span>
        <button onClick={() => setExpanded(!expanded)} className="text-amber-600 underline text-xs">
          {expanded ? 'Hide' : 'Setup steps'}
        </button>
      </div>
      {expanded && (
        <ol className="mt-2 ml-4 list-decimal text-amber-700 space-y-1">
          <li>Attach <code>SignInLocalDevelopmentAccess</code> managed policy to your IAM user/role</li>
          <li>Run <code>aws login</code></li>
          <li>Verify with <code>aws sts get-caller-identity</code></li>
        </ol>
      )}
    </div>
  )
}
