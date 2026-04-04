-- ============================================================
-- V3__add_product_images.sql
-- Add missing product images for all products that lack one
-- ============================================================

INSERT IGNORE INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES

-- Books (12–16)
(12, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', 'The 48 Laws of Power', 0, TRUE),
(13, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600', 'Dune', 0, TRUE),
(14, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600', 'The Midnight Library', 0, TRUE),
(15, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600', 'Sapiens', 0, TRUE),
(16, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', 'Project Hail Mary', 0, TRUE),

-- Clothing (17–22)
(17, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', "Levi's 501 Jeans", 0, TRUE),
(18, 'https://images.unsplash.com/photo-1584735175315-9d5df23be7be?w=600', 'Nike Air Force 1', 0, TRUE),
(19, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', 'Patagonia Better Sweater', 0, TRUE),
(20, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600', 'Zara Floral Midi Dress', 0, TRUE),
(21, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600', 'Lululemon Align Pant', 0, TRUE),
(22, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 'North Face Puffer Jacket', 0, TRUE),

-- Home & Kitchen (24–30; 23 already has an image)
(24, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600', 'Vitamix 5200 Blender', 0, TRUE),
(25, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', 'Lodge Cast Iron Skillet', 0, TRUE),
(26, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 'KitchenAid Stand Mixer', 0, TRUE),
(27, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600', 'Dyson V15 Vacuum', 0, TRUE),
(28, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 'Philips Airfryer XXL', 0, TRUE),
(29, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600', 'Ninja Foodi', 0, TRUE),
(30, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 'Breville Barista Express', 0, TRUE),

-- Sports (31–32, 34–40; 33 already has an image)
(31, 'https://images.unsplash.com/photo-1596357395217-80de13130e92?w=600', 'Peloton Bike+', 0, TRUE),
(32, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', 'Bowflex SelectTech Dumbbells', 0, TRUE),
(34, 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=600', 'Garmin Forerunner 955', 0, TRUE),
(35, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600', 'TRX Pro Suspension Kit', 0, TRUE),
(36, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600', 'Hydro Flask 32oz', 0, TRUE),
(37, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', 'Yeti Rambler Tumbler', 0, TRUE),
(38, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', 'Manduka PRO Yoga Mat', 0, TRUE),
(39, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', 'Theragun Pro', 0, TRUE),
(40, 'https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=600', 'Osprey Atmos AG 65 Pack', 0, TRUE),

-- More Electronics (41–43, 45–50; 44 already has an image)
(41, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', 'iPad Pro 12.9"', 0, TRUE),
(42, 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600', 'Amazon Echo Show 10', 0, TRUE),
(43, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', 'GoPro HERO12 Black', 0, TRUE),
(45, 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600', 'Nintendo Switch OLED', 0, TRUE),
(46, 'https://images.unsplash.com/photo-1455541504462-57ebb2a9cec1?w=600', 'Kindle Paperwhite 5', 0, TRUE),
(47, 'https://images.unsplash.com/photo-1558002038-1ad5c42fb3ed?w=600', 'Ring Video Doorbell 4', 0, TRUE),
(48, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 'Logitech MX Master 3S', 0, TRUE),
(49, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600', 'Samsung T7 2TB SSD', 0, TRUE),
(50, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', 'Anker 20000mAh PowerBank', 0, TRUE);
