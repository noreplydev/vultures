import { Worker, Queue } from 'bullmq';

const worker = new Worker(
  'scans',
  async job => {
    const hostname = job.name
    console.log("hostname: ", hostname)
  },
  {
    connection: {
      host: "localhost",
      port: "6379"
    }
  },
);

const scans = new Queue('scans');

export const addScanJob = async (hostname) => {
  await scans.add(hostname);
}