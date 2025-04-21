import path from 'path'
import { Level } from 'level'
import { getDirname } from '../utils/environment.js';

const dbsPath = path.join(getDirname(), "..", "..", "..", "..", "databases")
const entities = ["host", "cve"]

export const initDb = async (entity, encoding) => {
  const db = new Level(path.join(dbsPath, entity), {
    valueEncoding: encoding ?? 'json'
  });
  return db;
}

export const initDatabases = (encoding) => {
  return entities.map(async entity => {
    const db = await initDb(entity, encoding)
    await db.close()
  })
}

export const getDb = async (entity, encoding) => {
  const useDb = async (op) => _useDb(entity, op, encoding)

  return {
    getAll: async () => await useDb(async (db) => {
      const entries = []
      for await (const [key, value] of db.iterator()) {
        entries.push({ key, value })
      }
      return entries
    }),
    getIf: async (filter) => await useDb(async (db) => {
      const entries = []
      for await (const [key, value] of db.iterator()) {
        if (filter(key, value)) {
          entries.push({ key, value })
        }
      }
      return entries
    }),
    getPage: async ({ startKey, limit, reverse }) => await useDb(async (db) => {
      const entries = [];
      const iteratorOptions = { limit, reverse };

      if (startKey) { // if startkey is passed start from there 
        if (reverse) {
          iteratorOptions.lt = startKey;
        } else {
          iteratorOptions.gt = startKey;
        }
      }
      for await (const [key, value] of db.iterator(iteratorOptions)) {
        entries.push({ key, value });
      }
      return entries;
    }),
    get: async (key) => await useDb(async (db) => {
      try {
        const value = await db.get(key);
        return value;
      } catch (error) {
        // If the key is not found, Level returns an error with a `notFound` property.
        if (error.notFound) {
          return null;
        }
        throw error;
      }
    }),
    put: async (key, value, update) => await useDb(async (db) => {
      try {
        await db.put(key, value);
        return value;
      } catch (error) {
        throw error;
      }
    }),
    delete: async (key) => await useDb(async (db) => {
      try {
        await db.del(key);
        return true;
      } catch (error) {
        if (error.notFound) {
          return false;
        }
        throw error;
      }
    })
  }
}

const _useDb = async (entity, operation, encoding) => {
  const db = await initDb(entity, encoding)
  await db.open();
  try {
    return await operation(db);
  } finally {
    await db.close();
  }
}