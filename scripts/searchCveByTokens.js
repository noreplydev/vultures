import { Level } from 'level'

const db = new Level('../databases/cve', { valueEncoding: 'json' })
const titleDB = new Level('../databases/cve_titles', { valueEncoding: 'utf8' })

async function searchByTitle(substring) {
  substring = substring.toLowerCase()
  const results = []

  for await (const [key, id] of titleDB.iterator({ keys: true, values: true })) {
    if (key.includes(substring)) {
      const doc = await db.get(id)
      results.push({ id, title: key, doc })
    }
  }

  return results
}

; (async () => {
  const hits = await searchByTitle(process.argv[2])
  console.log(`Encontrados ${hits.length} CVEs:`, hits.map(h => h.id))
})()
