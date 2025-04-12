import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { getDb, initDb } from '../packages/vultures-api/src/db/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(__dirname, "..", "databases", "opencve-nvd")
const folders = fs.readdirSync(databasePath)
const IGNORED_ENTRIES = [".git"]
const total = [];

(async () => {
  initDb("cve")
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i]
    if (IGNORED_ENTRIES.includes(folder)) {
      continue
    }

    console.log("Processing year: ", folder)
    const yearPath = path.join(databasePath, folder)
    const yearCveFiles = fs.readdirSync(yearPath)
    for (let x = 0; x < yearCveFiles.length; x++) {
      const filename = yearCveFiles[x]
      const cveFilePath = path.join(yearPath, filename)
      const cveRawData = fs.readFileSync(cveFilePath)
      try {
        const cveData = JSON.parse(cveRawData)
        console.log(cveData.id)
        if (cveData.id) {
          const db = await getDb("cve")
          const insertion = await db.put(cveData.id, cveData)
          console.log(insertion)
        }
        total.push(cveData)
      } catch (err) {
        throw new Error("Error processing file: ", err)
      }
    }
  }
})()

console.log("Tota: ", total.length)