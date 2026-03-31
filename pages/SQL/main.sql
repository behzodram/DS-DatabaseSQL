-- INSERT_USER_PHONE_ROLE_:
INSERT OR IGNORE INTO users (phone, role) VALUES (?, ?);

-- UPDATE_USER_NAME_BY_PHONE_:
UPDATE users SET name = ? WHERE phone = ?;

-- UPDATE_USER_ROLE_BY_PHONE_:
UPDATE users SET role = ? WHERE phone = ?;
