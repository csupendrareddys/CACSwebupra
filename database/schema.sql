-- Database Schema for CACSwebupra
-- Based on the provided Draw.io diagram
-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20) UNIQUE,
    status VARCHAR(20) CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED')
    ),
    role VARCHAR(20) CHECK (
        role IN (
            'Service reciver',
            'Service provider',
            'Super_Admin',
            'Sub Admin'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aadhar_card VARCHAR(20) UNIQUE
);
-- Service Receiver Table
CREATE TABLE service_receivers (
    service_receiver_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    alternative_phone_number VARCHAR(20),
    languages JSONB,
    -- Preference wise
    address_id INT,
    -- Assuming separate address table or handled in logic
    aadhar_number VARCHAR(20) UNIQUE,
    medical_record_id VARCHAR(50),
    rating_by_user DECIMAL(3, 2),
    remarks_by_user TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Service Provider Table (Partners)
CREATE TABLE service_providers (
    service_provider_id SERIAL PRIMARY KEY,
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
    ),
    registration_date DATE,
    -- New fields for Partner Login requirements
    profession VARCHAR(50) CHECK (
        profession IN (
            'Chartered Accountant',
            'Company Secretary',
            'Lawyer',
            'Other'
        )
    ),
    other_profession VARCHAR(100),
    -- Only used if profession is 'Other'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Admins Table
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    address TEXT,
    document_req_pdf_link TEXT,
    registration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Document Related Services Table
CREATE TABLE document_related_services (
    document_id SERIAL PRIMARY KEY,
    document_type VARCHAR(100),
    service_id INT,
    -- This seems to link to vendor_services?
    state VARCHAR(50),
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Vendor Services Table
CREATE TABLE vendor_services (
    service_id SERIAL PRIMARY KEY,
    service_provider_id INT REFERENCES service_providers(service_provider_id),
    document_id INT REFERENCES document_related_services(document_id),
    document_type VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Orders Table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);