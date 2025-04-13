import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb } from '../packages/vultures-api/src/db/index.js';

let continueYear = null; // change this value to uso the continue system
const __dirname = dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(__dirname, "..", "databases", "opencve-nvd");
const folders = fs.readdirSync(databasePath);
const IGNORED_ENTRIES = [".git", "README.md", "last.json"];
const total = [];

(async () => {
  const db = await initDb("cve");
  await db.open();
  try {
    let batchOps = [];
    for (const folder of folders) {
      if (IGNORED_ENTRIES.includes(folder)) {
        continue;
      }
      if (continueYear) {
        if (continueYear !== folder) {
          console.log("Skipping " + folder);
          continue;
        } else {
          continueYear = null;
        }
      }

      console.log("Processing year: ", folder);
      const yearPath = path.join(databasePath, folder);
      const yearCveFiles = fs.readdirSync(yearPath);
      for (const filename of yearCveFiles) {
        const cveFilePath = path.join(yearPath, filename);
        const cveRawData = fs.readFileSync(cveFilePath);
        try {
          const cveData = JSON.parse(cveRawData);
          if (cveData.id) {
            batchOps.push({ type: 'put', key: cveData.id, value: cveData });
          }
          total.push(cveData);
        } catch (err) {
          console.error("Error processing file:", cveFilePath, err);
        }
      }

      if (batchOps.length > 0) {
        console.log(`Performing batch operation for folder ${folder} with ${batchOps.length} operations`);
        await db.batch(batchOps);
        batchOps = [];
      }
    }

    // process pending operations
    if (batchOps.length > 0) {
      console.log(`Performing final batch operation with ${batchOps.length} operations`);
      await db.batch(batchOps);
    }
  } catch (err) {
    console.error("Error during batch operations:", err);
  } finally {
    await db.close();
  }
  console.log("Total registros procesados:", total.length);
})();
