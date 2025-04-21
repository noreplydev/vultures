import path from 'path';
import { fileURLToPath } from 'url';
import { Level } from 'level';

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const entity = process.argv[2];
  if (!entity) {
    console.error('Usage: node populate-titles.js <entity>');
    process.exit(1);
  }

  // Paths
  const dbPath = path.join(__dirname, '..', 'databases', entity);
  const titleDbPath = path.join(__dirname, '..', 'databases', `${entity}-titles`);

  // Open LevelDB instances
  const db = new Level(dbPath, { valueEncoding: 'json' });
  const titleDB = new Level(titleDbPath, { valueEncoding: 'utf8' });

  console.log(`Indexing titles for entity: ${entity}`);

  let batchOps = [];
  let totalIndexed = 0;
  const BATCH_SIZE = 1000;

  for await (const [key, value] of db.iterator()) {
    const rawTitle = (value.descriptions[0].value || '').toString();
    const titleKey = rawTitle.trim().toLowerCase();
    if (titleKey) {
      batchOps.push({ type: 'put', key: titleKey, value: key });
    }

    if (batchOps.length >= BATCH_SIZE) {
      await titleDB.batch(batchOps);
      totalIndexed += batchOps.length;
      console.log(`  Batched ${batchOps.length} titles (total ${totalIndexed})`);
      batchOps = [];
    }
  }

  // flush remaining
  if (batchOps.length > 0) {
    await titleDB.batch(batchOps);
    totalIndexed += batchOps.length;
    console.log(`  Batched remaining ${batchOps.length} titles (total ${totalIndexed})`);
  }

  console.log(`✅ Title indexing complete: ${totalIndexed} entries indexed.`);
  await db.close();
  await titleDB.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
