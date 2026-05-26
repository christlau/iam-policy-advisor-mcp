import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

let client: Client | null = null

export async function connect(url: string) {
  if (client) return client
  client = new Client({ name: 'iam-policy-gen', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(url))
  await client.connect(transport)
  return client
}

export async function generatePolicies(
  sourceFiles: string[],
  region?: string,
  account?: string,
  serviceHints?: string[]
) {
  if (!client) throw new Error('MCP client not connected')
  const args: Record<string, unknown> = { SourceFiles: sourceFiles }
  if (region) args.Region = region
  if (account) args.Account = account
  if (serviceHints?.length) args.ServiceHints = serviceHints
  const result = await client.callTool({ name: 'generate_policies', arguments: args })
  return result
}

export async function generatePolicyForAccessDenied(errorMessage: string) {
  if (!client) throw new Error('MCP client not connected')
  return client.callTool({ name: 'generate_policy_for_access_denied', arguments: { ErrorMessage: errorMessage } })
}

export function disconnect() {
  if (client) {
    client.close()
    client = null
  }
}
