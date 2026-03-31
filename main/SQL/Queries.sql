-- CRT_USERS:
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    name TEXT,
    from_region TEXT,       -- faqat driver va shipper uchun
    to_region TEXT,         -- faqat driver va shipper uchun
    vehicle_type TEXT,      -- faqat driver va shipper uchun
    load_id INTEGER,        -- faqat shipper uchun

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT 0,

    FOREIGN KEY (load_id) REFERENCES loads(load_id)
);

-- Indexlar users uchun
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_is_synced ON users(is_synced);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at)

-- CRT_LOADS:
CREATE TABLE IF NOT EXISTS loads (
    load_id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_text TEXT NOT NULL,
    from_loc TEXT NOT NULL,
    to_loc TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    price TEXT DEFAULT '0',
    completed BOOLEAN DEFAULT 0,
    exp_at DATE NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT 0,

    FOREIGN KEY (owner_phone) REFERENCES users(phone)
);

-- Indexlar users uchun
CREATE INDEX IF NOT EXISTS idx_loads_owner_phone ON loads(owner_phone);
CREATE INDEX IF NOT EXISTS idx_loads_exp_at ON loads(exp_at);
CREATE INDEX IF NOT EXISTS idx_loads_is_synced ON loads(is_synced);
CREATE INDEX IF NOT EXISTS idx_loads_updated_at ON loads(updated_at)

-- CRT_DEALS:
CREATE TABLE IF NOT EXISTS deals (
    deal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_id INTEGER NOT NULL,
    driver_phone TEXT NOT NULL,
    shipper_phone TEXT NOT NULL,
    agreed_price TEXT,
    paid_to_driver TEXT,
    dispatcher_earning TEXT,
    status TEXT,
    payment_by TEXT,
    payed_status TEXT,
    payment_card TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT 0,
    
    FOREIGN KEY (load_id) REFERENCES loads(load_id),
    FOREIGN KEY (driver_phone) REFERENCES users(phone),
    FOREIGN KEY (shipper_phone) REFERENCES users(phone)
);

-- Indexlar users uchun
CREATE INDEX IF NOT EXISTS idx_deals_load_id ON deals(load_id);
CREATE INDEX IF NOT EXISTS idx_deals_driver_phone ON deals(driver_phone);
CREATE INDEX IF NOT EXISTS idx_deals_shipper_phone ON deals(shipper_phone);
CREATE INDEX IF NOT EXISTS idx_deals_is_synced ON deals(is_synced);
CREATE INDEX IF NOT EXISTS idx_deals_updated_at ON deals(updated_at)

-- CRT_CHATS:
CREATE TABLE IF NOT EXISTS chats (
    chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    load_id INTEGER NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT 0
);

-- Indexlar users uchun
CREATE INDEX IF NOT EXISTS idx_chats_phone ON chats(phone);
CREATE INDEX IF NOT EXISTS idx_chats_load_id ON chats(load_id);
CREATE INDEX IF NOT EXISTS idx_chats_is_synced ON chats(is_synced);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at)

-- CRT_CONFERENCE:
CREATE TABLE IF NOT EXISTS conference (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipper_phone TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    load_id INTEGER NOT NULL,
    status TEXT,
    price TEXT,
    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT 0
);

-- Indexlar users uchun
CREATE INDEX IF NOT EXISTS idx_conf_load_id ON conference(load_id);
CREATE INDEX IF NOT EXISTS idx_conf_driver_phone ON conference(driver_phone);
CREATE INDEX IF NOT EXISTS idx_conf_shipper_phone ON conference(shipper_phone);
CREATE INDEX IF NOT EXISTS idx_conf_is_synced ON conference(is_synced)

-- CRT_DRIVER_INTERESTED:
CREATE TABLE IF NOT EXISTS driver_interested (
    driver_phone TEXT NOT NULL,
    load_id INTEGER NOT NULL,
    price TEXT,
    description TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_synced BOOLEAN DEFAULT 0,

    PRIMARY KEY (driver_phone, load_id),
    FOREIGN KEY (driver_phone) REFERENCES users(phone),
    FOREIGN KEY (load_id) REFERENCES loads(load_id)
);

-- Indexlar users uchun
CREATE INDEX IF NOT EXISTS idx_di_driver_phone ON driver_interested(driver_phone);
CREATE INDEX IF NOT EXISTS idx_di_load_id ON driver_interested(load_id);
CREATE INDEX IF NOT EXISTS idx_di_is_synced ON driver_interested(is_synced)

-- DEL_USERS:
DROP TABLE IF EXISTS users

-- DEL_LOADS:
DROP TABLE IF EXISTS loads

-- DEL_DEALS:
DROP TABLE IF EXISTS deals

-- DEL_CHATS:
DROP TABLE IF EXISTS chats

-- DEL_CONFERENCE:
DROP TABLE IF EXISTS conference

-- DEL_DRIVER_INTERESTED:
DROP TABLE IF EXISTS driver_interested

-- LIST_TABLES:
SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'android_%' ORDER BY name

-- TABLE_DATA:
SELECT * FROM

-- TABLE_INFO:
PRAGMA table_info