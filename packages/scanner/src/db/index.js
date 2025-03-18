import path from 'path'
import { Level } from 'level'
import { getDirname } from '../utils/environment.js';

const dbsPath = path.join(getDirname(), "..", "..", "..", "..", "databases")
const entities = ["host"]

export const initDb = async (entity) => {
  const db = new Level(path.join(dbsPath, entity), {
    valueEncoding: 'json'
  });
  return db;
}

export const initDatabases = () => {
  return entities.map(async entity => {
    const db = await initDb(entity)
    await db.close()
  })
}

export const getDb = async (entity) => {
  return {
    getAll: async () => await useDb(entity, async (db) => {
      const entries = []
      for await (const [key, value] of db.iterator()) {
        entries.push({ key, value })
      }

      return entries
    }),
    get: async (key) => await useDb(entity, async (db) => {
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
    put: async (key, value, update) => await useDb(entity, async (db) => {
      try {
        await db.put(key, value);
        return value;
      } catch (error) {
        throw error;
      }
    }),
    delete: async (key) => await useDb(entity, async (db) => {
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

const useDb = async (entity, operation) => {
  const db = await initDb(entity)
  await db.open();
  try {
    return await operation(db);
  } finally {
    await db.close();
  }
}