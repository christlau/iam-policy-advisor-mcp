import { useMemo } from 'react'
import { findMatchingPolicies, extractActionsFromPolicy, type PolicyMatch } from '../services/policy-matcher'

interface Props {
  result: unknown
  onReset: () => void
}

export default function Results({ result, onReset }: Props) {
  const policyJson = useMemo(() => {
    try {
      const r = result as { content?: Array<{ text?: string }> }
      const text = r?.content?.[0]?.text || JSON.stringify(result, null, 2)
      // Try to extract JSON from the text
      const match = text.match(/\{[\s\S]*\}/)
      return match ? JSON.stringify(JSON.parse(match[0]), null, 2) : text
    } catch { return JSON.stringify(result, null, 2) }
  }, [result])

  const suggestions: PolicyMatch[] = useMemo(() => {
    const actions = extractActionsFromPolicy(policyJson)
    return findMatchingPolicies(actions)
  }, [policyJson])

  const copy = () => navigator.clipboard.writeText(policyJson)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Generated Policy</h1>
        <button onClick={onReset} className="text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Start Over</button>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">Custom Policy</h2>
          <button onClick={copy} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">Copy</button>
        </div>
        <pre className="bg-gray-900 text-green-300 p-4 rounded overflow-auto text-sm max-h-96">{policyJson}</pre>
      </section>

      {suggestions.length > 0 && (
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-3">Managed Policy Suggestions</h2>
          <div className="space-y-2">
            {suggestions.map(s => (
              <div key={s.arn} className="flex items-center justify-between border rounded p-3">
                <div>
                  <a href={`https://docs.aws.amazon.com/aws-managed-policy/latest/reference/${s.name}.html`}
                    target="_blank" rel="noopener" className="text-blue-600 font-medium hover:underline">{s.name}</a>
                  <p className="text-xs text-gray-500 font-mono">{s.arn}</p>
                </div>
                <span className={`text-sm font-bold ${s.coverage === 1 ? 'text-green-600' : 'text-amber-600'}`}>
                  {Math.round(s.coverage * 100)}% coverage
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-3">How to Attach</h2>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Ensure you're authenticated: <code className="bg-gray-100 px-1 rounded">aws login</code></li>
          <li>Save the policy above to a file: <code className="bg-gray-100 px-1 rounded">policy.json</code></li>
          <li>Create the policy:
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">aws iam create-policy --policy-name MyGeneratedPolicy --policy-document file://policy.json</pre>
          </li>
          <li>Attach to your role/user:
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">aws iam attach-role-policy --role-name YOUR_ROLE --policy-arn POLICY_ARN</pre>
          </li>
        </ol>
      </section>
    </div>
  )
}
