const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function init(){
  const dbPath = path.join(__dirname,'data','database.sqlite');
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      tags TEXT,
      link TEXT,
      date TEXT
    );
  `);
  return db;
}

let _dbPromise = init();

module.exports = {
  async run(sql, params){ const db = await _dbPromise; return db.run(sql, params); },
  async get(sql, params){ const db = await _dbPromise; return db.get(sql, params); },
  async all(sql, params){ const db = await _dbPromise; return db.all(sql, params); },
};
