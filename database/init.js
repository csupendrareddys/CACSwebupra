const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');

// Remove existing DB if you want to start fresh (optional, maybe dangerous for prod)
// fs.unlinkSync(dbPath); 

const db = new Database(dbPath);

console.log('Initializing database at', dbPath);

const schema = `
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20) UNIQUE,
    status VARCHAR(20) CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED')
    ) DEFAULT 'ACTIVE',
    role VARCHAR(20) CHECK (
        role IN (
            'Service_reciver',
            'Service_provider',
            'Super_Admin',
            'Sub_Admin'
        )
    ) DEFAULT 'Service_reciver',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    aadhar_card VARCHAR(20) UNIQUE
);

-- Service Receiver Table
CREATE TABLE IF NOT EXISTS service_receivers (
    service_receiver_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(user_id),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    alternative_phone_number VARCHAR(20),
    languages TEXT, -- JSON stored as TEXT
    address_id INT,
    aadhar_number VARCHAR(20) UNIQUE,
    medical_record_id VARCHAR(50),
    rating_by_user DECIMAL(3, 2),
    remarks_by_user TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Service Provider Table (Partners)
CREATE TABLE IF NOT EXISTS service_providers (
    service_provider_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(user_id),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    address TEXT,
    document_req_pdf_link TEXT,
    verification_status VARCHAR(20) CHECK (
        verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')
    ) DEFAULT 'PENDING',
    registration_date DATE,
    profession VARCHAR(50),
    other_profession VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(user_id),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    address TEXT,
    document_req_pdf_link TEXT,
    registration_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Document Related Services Table
CREATE TABLE IF NOT EXISTS document_related_services (
    document_id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_type VARCHAR(100),
    service_id INT,
    state VARCHAR(50),
    is_active BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Services Table
CREATE TABLE IF NOT EXISTS vendor_services (
    service_id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_provider_id INT REFERENCES service_providers(service_provider_id),
    document_id INT REFERENCES document_related_services(document_id),
    document_type VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INT REFERENCES document_related_services(document_id),
    customer_id INT REFERENCES service_receivers(service_receiver_id),
    vendor_id INT REFERENCES service_providers(service_provider_id),
    final_document_gen_pdf_link TEXT,
    final_price DECIMAL(10, 2),
    request_date DATE,
    arrived_date DATE,
    status VARCHAR(20) CHECK (
        status IN (
            'CREATED',
            'PAYMENT_PENDING',
            'PAYMENT_COMPLETED',
            'PROCESSING',
            'COMPLETED',
            'CANCELLED',
            'REFUNDED'
        )
    ),
    payment_status VARCHAR(20) CHECK (
        payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')
    ),
    kyc_status VARCHAR(20) CHECK (
        kyc_status IN ('NOT_REQUIRED', 'PENDING', 'VERIFIED', 'FAILED')
    ),
    rating_by_user DECIMAL(3, 2),
    remarks_by_user TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.exec(schema);
console.log('Database initialized successfully.');
db.close();
