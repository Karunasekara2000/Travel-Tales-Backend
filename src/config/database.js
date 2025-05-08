const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./auth.db');


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'USER'
        )
    `);
});


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS api_keys (
            id TEXT PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_used DATETIME,
            is_active BOOLEAN DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        api_key_id TEXT,
        ip_address TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
});



module.exports = db;
