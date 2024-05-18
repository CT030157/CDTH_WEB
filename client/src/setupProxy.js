const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//     app.use(
//         '/api/users',
//         createProxyMiddleware({
//             target: 'http://localhost:4444',
//             changeOrigin: true,
//         })
//     );
//     app.use(
//         '/api/products',
//         createProxyMiddleware({
//             target: 'http://localhost:4445',
//             changeOrigin: true,
//         })
//     );
//     app.use(
//         '/uploads',
//         createProxyMiddleware({
//             target: 'http://localhost:4445',
//             changeOrigin: true,
//         })
//     );
// };

module.exports = function (app) {
    app.use(
        '/api/users',
        createProxyMiddleware({
            target: 'https://cdth-web.vercel.app',
            changeOrigin: true,
        })
    );
    app.use(
        '/api/products',
        createProxyMiddleware({
            target: 'https://cdth-web.vercel.app',
            changeOrigin: true,
        })
    );
    app.use(
        '/uploads',
        createProxyMiddleware({
            target: 'https://cdth-web.vercel.app',
            changeOrigin: true,
        })
    );
};