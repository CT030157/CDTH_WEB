const { createProxyMiddleware } = require('http-proxy-middleware');

var host = window.location.protocol + "//" + window.location.hostname;

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: `${host}:4444`,
            changeOrigin: true,
        })
    );
};