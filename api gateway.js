const express = require('express');
const httpProxy = require('http-proxy');
const app = express();

// Create proxy server
const proxy = httpProxy.createProxyServer();

// Simple logging
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Gateway is working' });
});

// Route handlers for each service - Remove the /* from paths
app.all('/api/profiles', (req, res) => {
    console.log('Proxying to User Service:', req.method, req.url);
    proxy.web(req, res, {
        target: 'http://192.168.233.134:3002',
        changeOrigin: true
    });
});

app.all('/api/exercises', (req, res) => {
    console.log('Proxying to Exercise Service:', req.method, req.url);
    proxy.web(req, res, {
        target: 'http://192.168.233.134:3001',
        changeOrigin: true
    });
});

app.all('/api/progress', (req, res) => {
    console.log('Proxying to Progress Service:', req.method, req.url);
    proxy.web(req, res, {
        target: 'http://localhost:3003',
        changeOrigin: true
    });
});

// Error handling
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
});

app.listen(8080, '0.0.0.0', () => {
    console.log('Gateway running on port 8080');
    console.log('Routes configured:');
    console.log('- /api/profiles -> http://192.168.233.134:3002');
    console.log('- /api/exercises -> http://192.168.233.134:3001');
    console.log('- /api/progress -> http://localhost:3003');
});

