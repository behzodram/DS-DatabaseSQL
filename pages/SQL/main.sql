-- INSERT_USER_PHONE_ROLE_:
INSERT OR IGNORE INTO users (phone, role) VALUES (?, ?);

-- UPDATE_USER_NAME_BY_PHONE_:
UPDATE users SET name = ? WHERE phone = ?;

-- UPDATE_USER_ROLE_BY_PHONE_:
UPDATE users SET role = ? WHERE phone = ?;

-- INSERT_Load_RAW_FROM_TO_VEHICLE_OWNPhone_EXP_:
INSERT INTO loads (raw_text, from_loc, to_loc, vehicle_type, owner_phone, exp_at) VALUES (?,?,?,?,?,?);

-- INSERT_Deal_LoadID_DRWPhone_ShipPhone_STATUS_:
INSERT INTO deals (driver_phone, shipper_phone, status) VALUES (?,?,?);
