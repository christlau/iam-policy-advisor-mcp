import catalog from '../data/managed-policies.json'

interface ManagedPolicy {
  name: string
  arn: string
  actions: string[]
}

export interface PolicyMatch {
  name: string
  arn: string
  coverage: number
  matchedActions: string[]
}

function actionMatches(pattern: string, action: string): boolean {
  const p = pattern.toLowerCase()
  const a = action.toLowerCase()
  if (p === a) return true
  if (p.endsWith('*')) {
    const prefix = p.slice(0, -1)
    return a.startsWith(prefix)
  }
  return false
}

export function findMatchingPolicies(requiredActions: string[]): PolicyMatch[] {
  if (!requiredActions.length) return []

  const results: PolicyMatch[] = (catalog as ManagedPolicy[]).map(policy => {
    const matched = requiredActions.filter(req =>
      policy.actions.some(pa => actionMatches(pa, req))
    )
    return { name: policy.name, arn: policy.arn, coverage: matched.length / requiredActions.length, matchedActions: matched }
  })

  return results
    .filter(r => r.coverage > 0)
    .sort((a, b) => b.coverage - a.coverage)
    .slice(0, 5)
}

export function extractActionsFromPolicy(policyJson: string): string[] {
  try {
    const policy = JSON.parse(policyJson)
    const statements = policy.Statement || []
    const actions: string[] = []
    for (const stmt of statements) {
      const a = stmt.Action
      if (Array.isArray(a)) actions.push(...a)
      else if (a) actions.push(a)
    }
    return actions
  } catch { return [] }
}
