
-- INSERT_Load_RAW_FROM_TO_VEHICLE_OWNPhone_EXP_:
INSERT INTO loads (raw_text, from_loc, to_loc, vehicle_type, owner_phone, exp_at) VALUES (?,?,?,?,?,?);

-- INSERT_Deal_LoadID_DRWPhone_ShipPhone_STATUS_:
INSERT INTO deals (driver_phone, shipper_phone, status) VALUES (?,?,?);
