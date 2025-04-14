
import path from 'path'
import { fileURLToPath } from 'url'
import { config as envConfig } from 'dotenv'
import express from 'express'
import { CveRouter, HostsRouter, ScannerRouter } from 'vultures-api/src/routers/index.js'
import { initDatabases, initDb } from 'vultures-api/src/db/index.js'
import cors from 'cors'
// queue
import "vultures-api/src/queue.js"

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

envConfig({
  path: path.join(__dirname, "..", "..", ".env")
})

// initialize all databases
initDatabases()

// middlewares
app.use(cors({
  origin: "*"
}))
app.use(express.json())

const publicFolder = path.join(__dirname, "..", "..", "packages", "vultures-api", "static")
app.use("/static", express.static(publicFolder))

app.use("/api/v1/scanner", ScannerRouter)
app.use("/api/v1/hosts", HostsRouter)
app.use("/api/v0/cve", CveRouter)
app.use("/", (req, res) => res.sendFile(path.join(publicFolder, "index.html")))

app.listen(process.env.SCANNER_API_PORT, () => {
  console.log("Vultures scanner running on port: ", process.env.SCANNER_API_PORT)
})