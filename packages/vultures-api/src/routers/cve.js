import { app } from "../app.js";
import { getDb } from "../db/index.js";
import { getCveExtradata } from "../lib/cve/index.js";
import { DefaultData, response, responseError } from "../response.js";

const cveRegex = /^CVE-\d{4}-\d{4,}$/;
export const CveRouter = app()

CveRouter.get("/search", async (req, res) => {
  const query = req.query.query

  if (!query) {
    return responseError(res, 400, DefaultData, "Bad request, no query provided")
  }

  try {
    const db = await getDb("cve_titles", "utf8")
    const entries = await db.getIf((key, value) => key.includes(String(query).toLowerCase()))
    const cves = entries.map(entry => entry.value)
    return response(res, { entries: cves }, "Stored cves")
  } catch (err) {
    console.error("Error processing /api/v0/cve: ", err)
    return responseError(res, 500, DefaultData, "Internal server error")
  }
})

CveRouter.get("/:id", async (req, res) => {
  try {
    const cveId = req.params.id
    if (!cveRegex.test(cveId)) {
      return responseError(res, 400, { entry: null, extradata: null }, "provided bad id format")
    }
    const db = await getDb("cve")
    const entry = await db.get(cveId)
    const extradata = await getCveExtradata(cveId)
    response(res, { entry, extradata }, "specific cve data")
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