# Muhim SQL so‘rovlar
# 3.1. Haydovchiga HIGH_main yuklar (from va to to‘liq mos)
# sql
# SELECT l.* 
# FROM loads l
# WHERE l.from_loc = (SELECT from_region FROM users WHERE phone = '+998901111111')
#   AND l.to_loc = (SELECT to_region FROM users WHERE phone = '+998901111111')
#   AND l.completed = 0;
# 3.2. Haydovchiga LOW_main yuklar (faqat from mos)
# sql
# SELECT l.* 
# FROM loads l
# WHERE l.from_loc = (SELECT from_region FROM users WHERE phone = '+998901111111')
#   AND l.completed = 0;
# 3.3. Yuk egasining yuklariga qiziqish bildirgan haydovchilar (interested)
# sql
# SELECT di.driver_phone, u.name, di.price, di.chat, di.load_id
# FROM driver_interested di
# JOIN users u ON di.driver_phone = u.phone
# WHERE di.load_id IN (SELECT load_id FROM loads WHERE owner_phone = '+998906362704');
# 3.4. Bitim tuzilgan yukni to‘liq ko‘rish
# sql
# SELECT l.load_id, l.from_loc, l.to_loc,
#        d.agreed_price, d.paid_to_driver, d.dispatcher_earning,
#        d.driver_phone, d.shipper_phone, d.payment_by_phone
# FROM deals d
# JOIN loads l ON d.load_id = l.load_id
# WHERE l.owner_phone = '+998906362704';
# 3.5. Yukchi va haydovchi o‘rtasidagi konferensiya natijasi
# sql
# SELECT * FROM conference
# WHERE shipper_phone = '+998902222222'
#   AND driver_phone = '+998901111111'
# ORDER BY created_at DESC LIMIT 1;
# 3.6. Yukni bajarilgan deb belgilash va bitim yozish
# sql
# -- 1. Yukni completed qilish
# UPDATE loads SET completed = 1 WHERE load_id = '010';
# 
# -- 2. Deals jadvaliga yozish
# INSERT INTO deals (load_id, driver_phone, shipper_phone, agreed_price, paid_to_driver, dispatcher_earning, payment_by_phone, status)
# VALUES ('010', '+998901111111', '+998902222222', '2.8 mln', '2.6 mln', '0.2 mln', '+998902222222', 'completed');
# 3.7. Haydovchi qiziqish bildirgan yuklarni qo‘shish
# sql
# INSERT INTO driver_interested (driver_phone, load_id, price, chat)
# VALUES ('+998901111111', '018', '3 mln', 'Narxni tushirishni so‘radi');
# 3.8. Konferensiya natijasini saqlash
# sql
# INSERT INTO conference (shipper_phone, driver_phone, load_id, status, price)
# VALUES ('+998902222222', '+998901111111', '010', 'kelishdi', '2.8 mln');