import { promises as dns } from 'dns';

export const isOwnedDomain = async (domain) => {
  const records = await getDomainRecords(domain)
  if (!records) {
    throw new Error("Cannot get DNS records from domain")
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const [id, value] = record.split("=")
    if (String(id) === "vulture" && String(value) === "prey") {
      return true
    }
  }

  return false
}

export const getDomainRecords = async (domain) => {
  try {
    const records = await dns.resolve(domain, "TXT");
    return records.flat();
  } catch (err) {
    console.error(`Error resolving domain ${domain}: ${err}`);
    return null
  }
}