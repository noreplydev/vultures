import { Level } from 'level'

// db principal: id → JSON completo
const db = new Level('../databases/cve', { valueEncoding: 'json' })
// db “secundaria”: title → id
const titleDB = new Level('../databases/cve_titles', { valueEncoding: 'utf8' })

// Cuando creas/actualizas un CVE:
async function indexCVE(id, doc) {
  // 1) guardas el documento original
  await db.put(id, doc)

  // 2) metes un título “secundario”
  //    normalizeTitle = doc.title.toLowerCase().trim()
  const titleKey = doc.title.toLowerCase().trim()
  await titleDB.put(titleKey, id)
}

// Búsqueda “texto libre” en title keys:
async function searchByTitle(substring) {
  substring = substring.toLowerCase()
  const results = []

  // Sólo iteramos keys, no values
  for await (const [key, id] of titleDB.iterator({ keys: true, values: true })) {
    if (key.includes(substring)) {
      // Recupera el JSON original (u otro dato que quieras)
      const doc = await db.get(id)
      results.push({ id, title: key, doc })
    }
  }

  return results
}

// Uso:
; (async () => {
  // indexCVE('CVE-2025-1234', { title: 'Apache vuln …', /* … */ })

  const hits = await searchByTitle(process.argv[2])
  console.log(`Encontrados ${hits.length} CVEs:`, hits.map(h => h.id))
})()
