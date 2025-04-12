import { app } from "../app.js";
import { getDb } from "../db/index.js";
import { DefaultData, response } from "../response.js";

export const CveRouter = app()

/*
CveRouter.get("/", async (req, res) => {
  const db = await getDb("cve")
  const entries = await db.getAll()
  response(res, { entries }, "Stored hosts")
})
*/

CveRouter.get("/:id", async (req, res) => {
  const cveId = req.params.id
  const db = await getDb("cve")
  const entry = await db.get(cveId)
  response(res, { entry }, "specific cve data")
})


