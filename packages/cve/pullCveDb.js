/*
Downloader of the cve.org vulnerabilities database
https://github.com/CVEProject/cvelistV5/archive/refs/heads/main.zip

author: CREAT0R
date: 12/03/2025 <- in the most straightforward version, based on hierarchy
*/

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const extract = require('extract-zip');


const ASCII = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{};:'\",.<>/?\~".split("")

const generateRandomChunkId = () => {
  const id = []
  for (let i = 0; i < 5; i++) {
    id.push(ASCII[Math.floor(Math.random() * ASCII.length) + 1])
  }

  return id.join("")
}

async function fetchZip(url, tmpZipPath) {
  await new Promise((res, rej) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return fetchZip(response.headers.location, tmpZipPath).then(res).catch(rej);
      }
      if (response.statusCode !== 200) return rej(new Error(`Status code: ${response.statusCode}`));

      const total = parseInt(response.headers['content-length'], 10) || 0;
      let downloaded = 0;
      const file = fs.createWriteStream(tmpZipPath);

      response.on("data", chunk => {
        downloaded += chunk.length;
        if (total) {
          const percent = ((downloaded / total) * 100).toFixed(2);
          process.stdout.write(`\rFetching cve's: ${generateRandomChunkId()} ${percent}%`);
        } else {
          process.stdout.write(`\rFetching cve's: ${generateRandomChunkId()}`);
        }
      });

      response.pipe(file);
      file.on('finish', () => {
        process.stdout.write('\n');
        file.close(res);
      });
    }).on('error', err => fs.unlink(tmpZipPath, () => rej(err)));
  });
}

(async () => {
  console.log("") // \n at the start
  const url = "https://github.com/CVEProject/cvelistV5/archive/refs/heads/main.zip";
  const tmpZipPath = path.join(process.cwd(), 'temp.zip');

  // fetch de zip
  try {
    await fetchZip(url, tmpZipPath)
  } catch (err) {
    console.error("Error fetching CVE.org vulnerabilities database: ", err)
  }

  // decompress the zip
  const outDir = path.join(process.cwd(), 'pulled');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  await extract(tmpZipPath, { dir: outDir });
  fs.unlinkSync(tmpZipPath);
})();
