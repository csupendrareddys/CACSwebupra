const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const seedServices = () => {
    // Check if Partnership Registration exists
    const checkStmt = db.prepare('SELECT document_id FROM document_related_services WHERE document_type = ?');
    const existing = checkStmt.get('Partnership Registration');

    if (existing) {
        console.log('Service "Partnership Registration" already exists.');
        return;
    }

    const insertStmt = db.prepare('INSERT INTO document_related_services (document_type, state, is_active) VALUES (?, ?, ?)');

    try {
        const info = insertStmt.run('Partnership Registration', 'All India', 1);
        console.log(`Service Added: Partnership Registration (ID: ${info.lastInsertRowid})`);
    } catch (error) {
        console.error('Failed to seed service:', error);
    }
};

seedServices();
