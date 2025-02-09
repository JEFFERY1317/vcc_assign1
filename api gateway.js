const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Replace these IPs with your VM2 IP for exercise and user services
const VM2_IP = '192.168.233.134'; 
const VM3_IP = 'localhost'; 

// Configure proxies
const exerciseServiceProxy = createProxyMiddleware('/api/exercises', {
    target: `http://${VM2_IP}:3001`,
    changeOrigin: true
});

const userServiceProxy = createProxyMiddleware('/api/profiles', {
    target: `http://${VM2_IP}:3002`,
    changeOrigin: true
});
