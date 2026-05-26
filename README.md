# IAM Policy Generator

A static web app that generates least-privilege IAM policies from activity descriptions or existing code.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React + Vite)                                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │ Describe  │→│ LLM API  │→│ Stub Code             │ │
│  │ Activity  │  └──────────┘  └───────────┬───────────┘ │
│  └──────────┘                             │             │
│  ┌──────────┐                             ▼             │
│  │ Paste    │─────────────────→┌──────────────────────┐ │
│  │ Code     │                  │ Local Proxy (:8002)  │ │
│  └──────────┘                  │ writes temp file     │ │
│                                └──────────┬───────────┘ │
└───────────────────────────────────────────┼─────────────┘
                                            ▼
                               ┌────────────────────────┐
                               │ MCP Server (:8001)     │
                               │ iam-policy-autopilot   │
                               │ generate_policies tool │
                               └────────────┬───────────┘
                                            ▼
                               ┌────────────────────────┐
                               │ IAM Policy JSON +      │
                               │ Managed Policy Match   │
                               └────────────────────────┘
```

## Prerequisites

- Node.js 18+
- `iam-policy-autopilot` installed (`pip install iam-policy-autopilot` or `uvx iam-policy-autopilot`)
- AWS CLI configured with `aws login`

## Setup

1. **Authenticate with AWS:**
   ```bash
   # Ensure SignInLocalDevelopmentAccess policy is attached to your user/role
   aws login
   aws sts get-caller-identity
   ```

2. **Start the MCP server:**
   ```bash
   iam-policy-autopilot --transport http
   # Serves on http://localhost:8001/mcp
   ```

3. **Install and run:**
   ```bash
   npm install
   npm start  # Starts proxy + dev server concurrently
   ```

4. **Configure LLM provider** in the Settings page (API key, model, etc.)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start proxy + dev server |
| `npm run dev` | Vite dev server only |
| `npm run proxy` | Local proxy only (port 8002) |
| `npm run build` | Production build |

## Usage

1. **Describe Activity** — describe what AWS actions you need, select language, generate policy
2. **Paste Code / Provide Path** — paste code or provide a file path for analysis
