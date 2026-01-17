const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const generatePassword = () => {
    return crypto.randomBytes(8).toString('hex');
};

const seedAdmin = async () => {
    const email = 'admin@cacsupra.com';
    const password = 'Admin' + generatePassword() + '!'; // Ensure some complexity
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkStmt = db.prepare('SELECT user_id FROM users WHERE email = ?');
    const existing = checkStmt.get(email);

    if (existing) {
        console.log('Admin user already exists.');
        console.log('Email:', email);
        console.log('If you lost the password, please delete the user from DB and run this again, or manually update hash.');
        return;
    }

    const insertStmt = db.prepare(`
        INSERT INTO users (username, password_hash, email, first_name, role, status)
        VALUES (?, ?, ?, ?, 'Super_Admin', 'ACTIVE')
    `);

    try {
        const info = insertStmt.run('super_admin', hashedPassword, email, 'Super Admin');

        // Also add to admins table
        const insertAdminDetail = db.prepare('INSERT INTO admins (user_id, first_name) VALUES (?, ?)');
        insertAdminDetail.run(info.lastInsertRowid, 'Super Admin');

        console.log('=============================================');
        console.log('ADMIN USER CREATED SUCCESSFULLY');
        console.log('=============================================');
        console.log('URL: http://localhost:3000/admin-login');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('=============================================');
        console.log('PLEASE SAVE THESE CREDENTIALS NOW.');
    } catch (error) {
        console.error('Failed to create admin:', error);
    }
};

seedAdmin();
