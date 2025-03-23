
import path from 'path'
import { fileURLToPath } from 'url'
import { config as envConfig } from 'dotenv'
import express from 'express'
import { HostsRouter, ScannerRouter } from './routers/index.js'
import { initDatabases, initDb } from './db/index.js'
import cors from 'cors'
// queue
import "./queue.js"

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

envConfig({
  path: path.join(__dirname, "..", "..", "..", ".env")
})

// initialize all databases
initDatabases()

// middlewares
app.use(cors({
  origin: "*"
}))
app.use(express.json())

app.get("/hello-world", (req, res) => {
  return res.send("Hello world!")
})

app.use("/api/v1/scanner", ScannerRouter)
app.use("/api/v1/hosts", HostsRouter)

app.listen(process.env.SCANNER_API_PORT, () => {
  console.log("Vultures scanner running")
})