# ChaosApp - Dynatrace + GitHub MCP Autonomous Remediation Demo

This Node.js application intentionally uses a **vulnerable version of lodash (4.17.20)** to demonstrate an autonomous security remediation workflow using **Dynatrace MCP** and **GitHub MCP** servers.

## ⚠️ Intentional Vulnerability

```text
Package: lodash@4.17.20
CVE: CVE-2021-23337 (Command Injection)
CVE: CVE-2020-8203 (Prototype Pollution)
Severity: HIGH
Fix: Upgrade to lodash@4.17.21
```

## 🎯 Demo Workflow

When you ask Copilot:

> "Check Dynatrace for vulnerabilities in my app, fix any critical issues, create a PR, and deploy"

The MCP servers will:

1. **Dynatrace MCP** → Queries your Dynatrace environment for security vulnerabilities
2. **Copilot** → Identifies `lodash@4.17.20` needs to be upgraded to `4.17.21`
3. **GitHub MCP** → Creates a branch, commits the fix, opens a PR
4. **Copilot** → Reviews the PR changes
5. **GitHub MCP** → Merges the PR to main
6. **GitHub Actions** → Automatically deploys and reports event to Dynatrace

## 📋 Prerequisites

### 1. Dynatrace Setup

1. Deploy this app to a server monitored by Dynatrace OneAgent
2. Enable **Application Security** in Dynatrace
3. Create an API token with scopes:
   - `securityProblems.read`
   - `events.ingest`

### 2. GitHub Setup

1. Push this repo to GitHub
2. Add repository secrets:
   - `DYNATRACE_URL`: Your Dynatrace environment URL (e.g., `https://abc12345.live.dynatrace.com`)
   - `DYNATRACE_TOKEN`: Your Dynatrace API token

### 3. MCP Servers

Ensure you have access to:

- **Dynatrace MCP Server** - for querying vulnerabilities
- **GitHub MCP Server** - for creating PRs and managing code

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/ChaosApp.git
cd ChaosApp
npm install

# Run locally
npm start

# Check the app
curl http://localhost:3000/
curl http://localhost:3000/api/version
```

## 📁 Project Structure

```text
ChaosApp/
├── src/
│   └── server.js           # Express app with vulnerable lodash
├── .github/
│   └── workflows/
│       ├── deploy.yml      # Deploys on push to main, reports to Dynatrace
│       └── pr-validation.yml # Validates PRs, auto-approves security fixes
├── package.json            # Has lodash@4.17.20 (vulnerable)
└── README.md
```

## 🔄 The Autonomous Workflow

### Step 1: Ask Copilot to Check Vulnerabilities

```text
"Use Dynatrace to check for security vulnerabilities in my ChaosApp application"
```

Copilot will use **Dynatrace MCP** to query:

- Security problems
- Third-party vulnerabilities
- CVE details

### Step 2: Ask Copilot to Fix and Create PR

```text
"Fix the lodash vulnerability by upgrading to 4.17.21 and create a pull request"
```

Copilot will use **GitHub MCP** to:

- Create a branch `fix/CVE-2021-23337`
- Update `package.json` with `lodash@4.17.21`
- Commit and push changes
- Create a PR with description

### Step 3: Ask Copilot to Review and Merge

```text
"Review the security fix PR and merge it if the changes look correct"
```

Copilot will:

- Review the code changes
- Verify only lodash version changed
- Merge the PR

### Step 4: Automatic Deployment

When PR merges to `main`:

- **GitHub Actions** runs `deploy.yml`
- App is deployed to production
- Deployment event sent to Dynatrace

## 📊 Dynatrace Integration

### Viewing Vulnerabilities

In Dynatrace:

1. Go to **Application Security** → **Vulnerabilities**
2. Filter by application name "ChaosApp"
3. You'll see CVE-2021-23337 listed

### Viewing Deployment Events

After deployment:

1. Go to **Releases** in Dynatrace
2. Or check the Process Group for ChaosApp
3. Deployment events appear with version info

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | App info and vulnerability status |
| `/health` | GET | Health check for monitoring |
| `/api/version` | GET | Dependency versions |
| `/api/users` | GET | Sample users endpoint |
| `/api/process` | POST | Uses lodash.merge (vulnerable) |
| `/api/render` | POST | Uses lodash.template (vulnerable) |

## 📝 Example Copilot Prompts

### Full Autonomous Workflow

```text
Check Dynatrace for any critical vulnerabilities in ChaosApp. 
If you find any, fix them in the code, create a PR with the fix, 
review it, and merge it so GitHub Actions can deploy.
```

### Just Check Vulnerabilities

```text
Query Dynatrace for security problems affecting lodash in my application
```

### Just Create Fix

```text
Upgrade lodash from 4.17.20 to 4.17.21 in package.json and create a PR
```

## ⚙️ GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `DYNATRACE_URL` | Dynatrace environment URL |
| `DYNATRACE_TOKEN` | API token for events and security |

## 🔐 Security Note

This application **intentionally contains vulnerabilities** for demonstration purposes.

**DO NOT** deploy this to production without upgrading lodash!

## 📜 License

MIT - Demo purposes only
