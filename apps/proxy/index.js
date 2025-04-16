import { config as envConfig } from 'dotenv'
import path from 'path'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
envConfig({
  path: path.join(__dirname, "..", "..", ".env")
})

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: (path, req) => '/api/' + path,
}));

app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});
