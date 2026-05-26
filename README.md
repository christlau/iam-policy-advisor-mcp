# IAM Policy Advisor - Web UI

A React-based web interface for the [awslabs/iam-policy-autopilot](https://github.com/awslabs/iam-policy-autopilot) MCP server. This tool provides a user-friendly web UI that generates IAM policies from activity descriptions or existing code.

## What's Different from the Original

This project builds on top of the excellent `iam-policy-autopilot` MCP server by AWS Labs, adding:

- **Web-based Interface**: React + TypeScript frontend instead of CLI-only
- **Dual Input Modes**: Describe activities in plain text OR paste/provide existing code
- **LLM Integration**: Converts activity descriptions to AWS SDK stub code via configurable LLM providers (OpenAI, Bedrock, Custom)
- **Local Proxy Bridge**: Solves browser-to-MCP file system access via a Node.js proxy
- **Managed Policy Matching**: Suggests existing AWS managed policies when they cover your needs
- **Tailscale Ready**: Configured for secure access across your tailnet
- **No Hardcoded Keys**: Enforces `aws login` with `SignInLocalDevelopmentAccess` policy

The original `iam-policy-autopilot` remains the core engine - this project just makes it more accessible via a modern web interface.

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

This web UI requires the original AWS Labs MCP server to function:

- **Node.js 18+** (for the web interface)
- **[iam-policy-autopilot](https://github.com/awslabs/iam-policy-autopilot)** MCP server:
  ```bash
  # Install via pip
  pip install iam-policy-autopilot
  
  # Or via uvx (recommended)
  uvx iam-policy-autopilot
  ```
- **AWS CLI** configured with `aws login` and `SignInLocalDevelopmentAccess` policy attached

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

## Credits

This project is built on top of the excellent work by AWS Labs:
- **Core Engine**: [awslabs/iam-policy-autopilot](https://github.com/awslabs/iam-policy-autopilot) - The MCP server that does the actual policy generation
- **Web Interface**: This repository - Adds React frontend and browser accessibility

All policy generation logic, AWS SDK analysis, and IAM knowledge comes from the original AWS Labs project. This is purely a UI layer to make it more accessible.
