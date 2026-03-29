-- CRT_USERS:
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_or_tg TEXT UNIQUE NOT NULL,
    name TEXT
)

-- CRT_LOADS:
CREATE TABLE IF NOT EXISTS loads (
    load_id INTEGER PRIMARY KEY AUTOINCREMENT,
    posted_by_user_id INTEGER,
    from_region TEXT NOT NULL,
    to_region TEXT NOT NULL,
    description TEXT,
    vehicle_type TEXT,
    exp_at TIMESTAMP,
    status TEXT DEFAULT 'LOW_main',
    FOREIGN KEY (posted_by_user_id) REFERENCES users(user_id)
)

-- CRT_LD_CONTACTS:
CREATE TABLE IF NOT EXISTS load_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_id INTEGER NOT NULL,
    contact_user_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    FOREIGN KEY (load_id) REFERENCES loads(load_id),
    FOREIGN KEY (contact_user_id) REFERENCES users(user_id)
)

-- CRT_DRIVERS:
CREATE TABLE IF NOT EXISTS drivers (
    driver_user_id INTEGER PRIMARY KEY,
    name TEXT,
    phone TEXT UNIQUE,
    from_region TEXT,
    to_region TEXT
)

-- CRT_DRV_INTEREST:
CREATE TABLE IF NOT EXISTS driver_interest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_user_id INTEGER NOT NULL,
    load_id INTEGER NOT NULL,
    price TEXT,
    chat TEXT,
    status TEXT DEFAULT 'interested',
    FOREIGN KEY (driver_user_id) REFERENCES drivers(driver_user_id),
    FOREIGN KEY (load_id) REFERENCES loads(load_id)
)

-- CRT_LD_CHAT:
CREATE TABLE IF NOT EXISTS load_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_from_id INTEGER NOT NULL,
    user_to_id INTEGER NOT NULL,
    load_id INTEGER NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_from_id) REFERENCES users(user_id),
    FOREIGN KEY (user_to_id) REFERENCES users(user_id),
    FOREIGN KEY (load_id) REFERENCES loads(load_id)
)

-- CRT_LD_CONFERENCE:
CREATE TABLE IF NOT EXISTS load_conference (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_user_id INTEGER NOT NULL,
    load_id INTEGER NOT NULL,
    result TEXT,
    price TEXT,
    chat_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_user_id) REFERENCES drivers(driver_user_id),
    FOREIGN KEY (load_id) REFERENCES loads(load_id)
)

-- DEL_USERS:
DROP TABLE IF EXISTS users

-- DEL_LOADS:
DROP TABLE IF EXISTS loads

-- DEL_LD_CONTACTS:
DROP TABLE IF EXISTS load_contacts

-- DEL_DRIVERS:
DROP TABLE IF EXISTS drivers

-- DEL_DRV_INTEREST:
DROP TABLE IF EXISTS driver_interest

-- DEL_LD_CHAT:
DROP TABLE IF EXISTS load_chat

-- DEL_LD_CONFERENCE:
DROP TABLE IF EXISTS load_conference

-- LIST_TABLES:
SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'android_%' ORDER BY name

-- TABLE_DATA:
SELECT * FROM

-- TABLE_INFO:
PRAGMA table_info