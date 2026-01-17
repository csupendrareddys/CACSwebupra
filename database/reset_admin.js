const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const reset = async () => {
    const email = 'admin@cacsupra.com';
    const newPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateStmt = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?');
    const info = updateStmt.run(hashedPassword, email);

    if (info.changes > 0) {
        console.log('Password updated successfully.');
        console.log('Example: Admin123!');
    } else {
        console.log('Admin user not found. Please run seed_admin.js first.');
    }
};

reset();
