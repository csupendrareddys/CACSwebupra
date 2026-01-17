import Database from 'better-sqlite3';
import path from 'path';

// Singleton connection to ensure we don't open too many handles
// In Next.js dev mode, this file might be re-executed, so we attach to global if needed
// But better-sqlite3 handles sync connections well.

const dbPath = path.join(process.cwd(), 'database', 'database.sqlite');

let db: any;

try {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL'); // Better for concurrency
} catch (error) {
    console.error("Failed to connect to SQLite:", error);
    throw error;
}

export default db;
