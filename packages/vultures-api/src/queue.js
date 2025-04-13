import { Worker, Queue } from 'bullmq';
import { getServices, scanHost } from './lib/nmap.js';
import { getDb } from './db/index.js';

let scans = null;
export const initWorker = () => {
  const worker = new Worker(
    'scans',
    async job => {
      try {
        const hostname = job.name
        console.log("scanning host:", hostname)

        const { isError, scan } = await scanHost(hostname)
        if (isError) return
        const services = getServices(scan.nmaprun.host)

        const db = await getDb("host")
        const host = await db.get(hostname)
        host['services'] = services

        // update entity
        await db.put(host.hostname, host)
        console.log("scan end of host:", hostname)
      } catch (err) {
        console.log("Error scanning host: ", err)
      }
    },
    {
      connection: {
        host: "localhost",
        port: "6379"
      }
    },
  );

  scans = new Queue('scans');
}

export const addScanJob = async (hostname) => {
  if (scans) {
    await scans.add(hostname);
  }
}