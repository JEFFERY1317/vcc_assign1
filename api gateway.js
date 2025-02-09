const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();


const VM2_IP = '192.168.233.134'; 
const VM3_IP = 'localhost'; 

const exerciseServiceProxy = createProxyMiddleware('/api/exercises', {
    target: `http://${VM2_IP}:3001`,
    changeOrigin: true
});

const userServiceProxy = createProxyMiddleware('/api/profiles', {
    target: `http://${VM2_IP}:3002`,
    changeOrigin: true
});

const progressServiceProxy = createProxyMiddleware('/api/progress', {
    target: `http://${VM3_IP}:3003`,
    changeOrigin: true
});


app.use('/api/exercises', exerciseServiceProxy);
app.use('/api/profiles', userServiceProxy);
app.use('/api/progress', progressServiceProxy);

app.listen(8080, () => {
    console.log('API Gateway running on port 8080');
});
