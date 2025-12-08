/**
 * ChaosApp - Vulnerable Application for MCP Autonomous Remediation
 * 
 * This app uses lodash@4.17.20 which has known vulnerabilities:
 * - CVE-2021-23337: Command Injection
 * - CVE-2020-8203: Prototype Pollution
 * 
 * Workflow with Dynatrace + GitHub MCP:
 * 1. Dynatrace detects vulnerability in running app
 * 2. You ask Copilot to check Dynatrace for vulnerabilities
 * 3. Copilot uses Dynatrace MCP to get vulnerability info
 * 4. Copilot fixes the code and uses GitHub MCP to create PR
 * 5. Copilot reviews and merges the PR
 * 6. GitHub Actions deploys the fix
 * 7. Deployment event is sent to Dynatrace
 */

require('dotenv').config();
const express = require('express');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = require('../package.json').version;
const LODASH_VERSION = require('lodash/package.json').version;

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    req.requestId = uuidv4();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check - Dynatrace monitors this
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        version: APP_VERSION,
        timestamp: new Date().toISOString()
    });
});

// Version info - shows dependency versions for Dynatrace to scan
app.get('/api/version', (req, res) => {
    res.json({
        application: 'ChaosApp',
        version: APP_VERSION,
        runtime: {
            node: process.version,
            platform: process.platform
        },
        dependencies: {
            lodash: LODASH_VERSION,
            express: require('express/package.json').version,
            axios: require('axios/package.json').version
        }
    });
});

// Data processing - uses vulnerable lodash.merge
app.post('/api/process', (req, res) => {
    try {
        const { data } = req.body;
        // lodash.merge in 4.17.20 is vulnerable to prototype pollution
        const result = _.merge({}, { processed: true, timestamp: Date.now() }, data);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Template rendering - uses vulnerable lodash.template
app.post('/api/render', (req, res) => {
    try {
        const { template, variables } = req.body;
        // lodash.template in 4.17.20 is vulnerable to command injection
        const compiled = _.template(template || 'Hello <%= name %>!');
        const result = compiled(variables || { name: 'World' });
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Users endpoint - example business logic
app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ];
    res.json(_.filter(users, req.query));
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'ChaosApp',
        version: APP_VERSION,
        description: 'Demo app for Dynatrace + GitHub MCP autonomous security remediation',
        lodashVersion: LODASH_VERSION,
        isVulnerable: LODASH_VERSION === '4.17.20',
        endpoints: [
            'GET  / - This info',
            'GET  /health - Health check',
            'GET  /api/version - Dependency versions',
            'GET  /api/users - List users',
            'POST /api/process - Process data (uses lodash.merge)',
            'POST /api/render - Render template (uses lodash.template)'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    const isVulnerable = LODASH_VERSION === '4.17.20';
    console.log(`
┌──────────────────────────────────────────────────────────────┐
│  ChaosApp v${APP_VERSION}                                            │
├──────────────────────────────────────────────────────────────┤
│  Server:  http://localhost:${PORT}                              │
│  Lodash:  ${LODASH_VERSION}                                         │
│  Status:  ${isVulnerable ? '⚠️  VULNERABLE (CVE-2021-23337)' : '✅ SECURE'}              │
└──────────────────────────────────────────────────────────────┘
    `);
});

module.exports = app;
