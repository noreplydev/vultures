
import path from 'path'
import { fileURLToPath } from 'url';
import { config as envConfig } from 'dotenv'
import express from 'express'
import { ScannerRouter } from './scanner.js';
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

envConfig({
  path: path.join(__dirname, "..", "..", "..", ".env")
})

app.get("/hello-world", (req, res) => {
  return res.send("Hello world!")
})

app.use("/api/v1/scanner", ScannerRouter)

app.listen(process.env.SCANNER_API_PORT, () => {
  console.log("Vultures scanner running")
})