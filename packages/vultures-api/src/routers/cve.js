import { app } from "../app.js";
import { getDb } from "../db/index.js";
import { DefaultData, response, responseError } from "../response.js";

export const CveRouter = app()

CveRouter.get("/:id", async (req, res) => {
  try {
    const cveId = req.params.id
    const db = await getDb("cve")
    const entry = await db.get(cveId)
    response(res, { entry }, "specific cve data")
  } catch (err) {
    console.error("Error processing /api/v0/cve: ", err)
    return responseError(res, 500, DefaultData, "Internal server error")
  }
})

CveRouter.get("/", async (req, res) => {
  const entriesLimit = 100
  const reverse = String(req.query.order) === "desc"
  const page = parseInt(req.query.page ?? '0', 10);

  try {
    const db = await getDb("cve")
    const firstBatch = await db.getPage({ limit: entriesLimit, reverse })
    if (page === 0) {
      return response(res, { entries: firstBatch, page }, "Stored cves")
    } else {
      let mem = null
      let paginatedBatch = null
      for (let i = 0; i <= page; i++) {
        const batch = await db.getPage({ limit: entriesLimit, reverse, startKey: mem ? mem : undefined })
        if (!batch.length) break; // avoid breaking on page overflow
        paginatedBatch = batch
        mem = batch[batch.length - 1].key
      }
      return response(res, { entries: paginatedBatch, page }, "Stored cves")
    }
  } catch (err) {
    console.error("Error processing /api/v0/cve: ", err)
    return responseError(res, 500, DefaultData, "Internal server error")
  }
})

