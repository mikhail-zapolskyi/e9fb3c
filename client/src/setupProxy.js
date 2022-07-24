const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.BE_PORT || 8080;
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
    })
  );
  app.use(
    "/auth",
    createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
    })
  );
};
