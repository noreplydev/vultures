import { getDomainRecords, isOwnedDomain } from "../lib/dns.js"
import { responseError, response } from "../response.js";
import { addScanJob } from "../queue.js";
import { app } from "../app.js";

export const ScannerRouter = app()
const DOMAIN_REGEX = /^(?=.{1,253}$)(?:(?!-)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2,})$/;

// /api/v1/scanner
ScannerRouter.get("/services/:hostname", async (req, res) => {
  try {
    const hostname = req.params.hostname
    addScanJob(hostname)
    return response(res, {}, "Ok")
  } catch (err) {
    return responseError(res, 500, null, "Internal server error")
  }
})

ScannerRouter.get("/domains/:domain/validation", async (req, res) => {
  const domain = req.params.domain

  if (!DOMAIN_REGEX.test(domain)) {
    return responseError(res, 400, null, "Bad domain format")
  }

  try {
    const isValidDomain = await isOwnedDomain(domain)
    if (!isValidDomain) {
      return response(res, { isValid: false }, "Cannot verify domain ownership")
    }

    return response(res, { isValid: true }, "Ok")
  } catch (err) {
    return responseError(res, 400, null, "Cannot get DNS records from domain")
  }
})
