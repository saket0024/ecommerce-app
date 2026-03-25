-- ============================================================
-- V2__seed_data.sql - Seed Data
-- All passwords are BCrypt hash of "Password123!"
-- ============================================================

-- Categories
INSERT IGNORE INTO categories (id, name, slug, image_url, parent_category_id) VALUES
(1,  'Electronics',       'electronics',         'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', NULL),
(2,  'Books',             'books',               'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', NULL),
(3,  'Clothing',          'clothing',            'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400', NULL),
(4,  'Home & Kitchen',    'home-kitchen',        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', NULL),
(5,  'Sports',            'sports',              'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', NULL),
-- Sub-categories
(6,  'Smartphones',       'smartphones',         'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 1),
(7,  'Laptops',           'laptops',             'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 1),
(8,  'Audio',             'audio',               'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1),
(9,  'Fiction',           'fiction',             'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 2),
(10, 'Non-Fiction',       'non-fiction',         'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 2),
(11, "Men's Clothing",    'mens-clothing',       'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400', 3),
(12, "Women's Clothing",  'womens-clothing',     'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400', 3),
(13, 'Kitchen Tools',     'kitchen-tools',       'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 4),
(14, 'Fitness',           'fitness',             'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 5);

-- Users (password = BCrypt of "Password123!")
INSERT IGNORE INTO users (id, first_name, last_name, email, password, role, is_active, created_at, updated_at) VALUES
(1,  'Admin',    'User',      'admin@ecommerce.com',    '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'ADMIN',    TRUE, NOW(), NOW()),
(2,  'Alice',    'Johnson',   'alice@example.com',      '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(3,  'Bob',      'Smith',     'bob@example.com',        '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(4,  'Carol',    'Davis',     'carol@example.com',      '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(5,  'David',    'Wilson',    'david@example.com',      '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(6,  'Emma',     'Brown',     'emma@example.com',       '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(7,  'Frank',    'Martinez',  'frank@example.com',      '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(8,  'Grace',    'Lee',       'grace@example.com',      '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(9,  'Henry',    'Taylor',    'henry@example.com',      '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW()),
(10, 'Iris',     'Anderson',  'iris@example.com',       '$2a$10$rTLv5/oG3LKvM6cXE9M4u.6HCrPt1uICVbR2bv9GhBN8o6wI/tRYy', 'CUSTOMER', TRUE, NOW(), NOW());

-- Products - Electronics
INSERT IGNORE INTO products (id, name, description, price, discount_percent, stock_quantity, sku, brand, rating, review_count, category_id, is_active, created_at) VALUES
(1,  'iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max 256GB - Titanium finish with A17 Pro chip', 1199.99, 5,  50, 'APPL-IP15PM-256', 'Apple',   4.80, 245, 6,  TRUE, NOW()),
(2,  'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra 512GB with S Pen, 200MP camera', 1099.99, 8,  75, 'SAMS-S24U-512',  'Samsung', 4.72, 189, 6,  TRUE, NOW()),
(3,  'Google Pixel 8 Pro', 'Google Pixel 8 Pro 256GB with Google AI features and 50MP camera', 899.99,  10, 40, 'GOOG-PX8P-256',  'Google',  4.65, 134, 6,  TRUE, NOW()),
(4,  'MacBook Pro 16" M3', 'Apple MacBook Pro 16-inch M3 Pro chip, 18GB RAM, 512GB SSD', 2499.99, 0,  30, 'APPL-MBP16-M3',  'Apple',   4.90, 312, 7,  TRUE, NOW()),
(5,  'Dell XPS 15', 'Dell XPS 15 OLED, Intel Core i9, 32GB RAM, 1TB SSD, RTX 4070', 1899.99, 12, 25, 'DELL-XPS15-I9',  'Dell',    4.55, 98,  7,  TRUE, NOW()),
(6,  'ASUS ROG Zephyrus G14', 'ASUS ROG Zephyrus G14 Gaming Laptop AMD Ryzen 9, RTX 4090', 1799.99, 5,  35, 'ASUS-ROG-G14',   'ASUS',    4.70, 156, 7,  TRUE, NOW()),
(7,  'Sony WH-1000XM5', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 349.99,  15, 120,'SONY-WH1000XM5', 'Sony',    4.85, 567, 8,  TRUE, NOW()),
(8,  'Apple AirPods Pro 2', 'Apple AirPods Pro 2nd Gen with USB-C, Active Noise Cancellation', 249.99,  0,  200,'APPL-APP2-USC',  'Apple',   4.75, 423, 8,  TRUE, NOW()),
(9,  'Bose QuietComfort 45', 'Bose QC45 Wireless Noise Cancelling Headphones 24hr battery', 279.99,  10, 80, 'BOSE-QC45-BLK',  'Bose',    4.60, 234, 8,  TRUE, NOW()),
(10, 'Samsung 65" 4K QLED TV', 'Samsung 65-inch Class QLED 4K Q80C Smart TV', 1299.99, 20, 15, 'SAMS-TV65-Q80C', 'Samsung', 4.68, 145, 1,  TRUE, NOW());

-- Products - Books
INSERT IGNORE INTO products (id, name, description, price, discount_percent, stock_quantity, sku, brand, rating, review_count, category_id, is_active, created_at) VALUES
(11, 'Atomic Habits', 'Atomic Habits by James Clear - An Easy & Proven Way to Build Good Habits', 16.99,  0,  500,'BOOK-AH-JC',     'Avery',   4.90, 1289, 10, TRUE, NOW()),
(12, 'The 48 Laws of Power', 'The 48 Laws of Power by Robert Greene', 18.99,  5,  400,'BOOK-48LAW-RG',  'Penguin', 4.65, 892,  10, TRUE, NOW()),
(13, 'Dune', 'Dune by Frank Herbert - The bestselling science fiction novel', 14.99,  0,  600,'BOOK-DUNE-FH',   'Ace',     4.88, 2341, 9,  TRUE, NOW()),
(14, 'The Midnight Library', 'The Midnight Library by Matt Haig - A novel about possibilities', 15.99,  10, 350,'BOOK-TML-MH',    'Viking',  4.72, 1102, 9,  TRUE, NOW()),
(15, 'Sapiens', 'Sapiens: A Brief History of Humankind by Yuval Noah Harari', 19.99,  0,  450,'BOOK-SAP-YNH',   'Harper',  4.78, 1567, 10, TRUE, NOW()),
(16, 'Project Hail Mary', 'Project Hail Mary by Andy Weir - A lone astronaut saves Earth', 17.99,  5,  280,'BOOK-PHM-AW',    'Ballant', 4.92, 891,  9,  TRUE, NOW());

-- Products - Clothing
INSERT IGNORE INTO products (id, name, description, price, discount_percent, stock_quantity, sku, brand, rating, review_count, category_id, is_active, created_at) VALUES
(17, "Levi's 501 Original Jeans", "Levi's 501 Original Fit Jeans - Classic straight leg denim", 69.99,  0,  200,'LEVI-501-M-32',  "Levi's",  4.55, 678,  11, TRUE, NOW()),
(18, 'Nike Air Force 1 Low', 'Nike Air Force 1 Low White - Classic basketball inspired sneaker', 110.00, 0,  150,'NIKE-AF1-WHT',   'Nike',    4.70, 1234, 11, TRUE, NOW()),
(19, 'Patagonia Better Sweater', "Patagonia Men's Better Sweater Fleece Jacket", 139.00, 20, 80, 'PAT-BS-M-L',    'Patagonia',4.80, 345, 11, TRUE, NOW()),
(20, 'Zara Floral Midi Dress', 'Zara Floral Print Midi Dress with Ruffled Hem', 59.99,  30, 120,'ZARA-FMD-W-M',  'Zara',    4.40, 234,  12, TRUE, NOW()),
(21, "Lululemon Align Pant", "Lululemon Women's Align High-Rise Pant 28\"", 98.00,  0,  100,'LULU-AP-W-6',   'Lululemon',4.85, 892, 12, TRUE, NOW()),
(22, "North Face Puffer Jacket", "The North Face Women's 550 Down Puffer Jacket", 199.00, 15, 60, 'TNF-PJ-W-M',    'The North Face', 4.70, 456, 12, TRUE, NOW());

-- Products - Home & Kitchen
INSERT IGNORE INTO products (id, name, description, price, discount_percent, stock_quantity, sku, brand, rating, review_count, category_id, is_active, created_at) VALUES
(23, 'Instant Pot Duo 7-in-1', 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 8 Quart', 99.99,  20, 200,'INST-DUO-8QT',  'Instant Pot', 4.75, 2345, 13, TRUE, NOW()),
(24, 'Vitamix 5200 Blender', 'Vitamix 5200 Blender Professional-Grade with Variable Speed', 449.99, 0,  40, 'VITM-5200-BLK', 'Vitamix',  4.90, 1234, 13, TRUE, NOW()),
(25, 'Lodge Cast Iron Skillet', 'Lodge 12 Inch Cast Iron Skillet Pre-Seasoned Ready to Use', 44.99,  0,  300,'LODG-CI-12',    'Lodge',    4.85, 3456, 13, TRUE, NOW()),
(26, 'KitchenAid Stand Mixer', 'KitchenAid 5-Qt. Artisan Series Tilt-Head Stand Mixer', 449.99, 10, 35, 'KAID-KSM150',   'KitchenAid',4.88, 2890, 13, TRUE, NOW()),
(27, 'Dyson V15 Detect Vacuum', 'Dyson V15 Detect Cordless Vacuum Cleaner Laser Dust', 699.99, 5,  45, 'DSON-V15-DET',  'Dyson',    4.72, 567,  4,  TRUE, NOW()),
(28, 'Philips Airfryer XXL', 'Philips Premium XXL Airfryer with Fat Removal Technology', 249.99, 15, 90, 'PHIL-AFXXL',    'Philips',  4.65, 789,  13, TRUE, NOW()),
(29, 'Ninja Foodi 11-in-1', 'Ninja Foodi 11-in-1 Pro 6.5qt Pressure Cooker & Air Fryer', 179.99, 10, 110,'NINJ-FF11-65',  'Ninja',    4.70, 1023, 13, TRUE, NOW()),
(30, 'Breville Barista Express', 'Breville Barista Express Espresso Machine with Built-in Grinder', 699.99, 0, 30, 'BREV-BES870XL', 'Breville', 4.82, 890, 13, TRUE, NOW());

-- Products - Sports
INSERT IGNORE INTO products (id, name, description, price, discount_percent, stock_quantity, sku, brand, rating, review_count, category_id, is_active, created_at) VALUES
(31, 'Peloton Bike+', 'Peloton Bike+ with Auto-Follow Resistance and 23.8" Rotating Touchscreen', 2495.00, 0,  10, 'PELO-BIKE-PLUS', 'Peloton', 4.60, 456,  14, TRUE, NOW()),
(32, 'Bowflex SelectTech 552', 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair)', 429.00, 10, 50, 'BOWF-552-PAIR', 'Bowflex', 4.78, 1234, 14, TRUE, NOW()),
(33, 'Nike Air Zoom Pegasus 40', 'Nike Air Zoom Pegasus 40 Running Shoes', 130.00, 0,  120,'NIKE-AZP40-M-10','Nike',   4.72, 789,  14, TRUE, NOW()),
(34, 'Garmin Forerunner 955', 'Garmin Forerunner 955 Solar GPS Running Smartwatch', 499.99, 5,  60, 'GARM-FR955-BLK','Garmin',  4.80, 345,  14, TRUE, NOW()),
(35, 'TRX Pro Suspension Kit', 'TRX PRO3 Suspension Training System', 199.95, 0,  80, 'TRX-PRO3-KIT',  'TRX',     4.75, 567,  14, TRUE, NOW()),
(36, 'Hydro Flask 32oz Bottle', 'Hydro Flask 32oz Wide Mouth Insulated Water Bottle', 44.95,  0,  250,'HYFL-32WM-BLK', 'Hydro Flask',4.90, 2890, 5, TRUE, NOW()),
(37, 'Yeti Rambler 20oz Tumbler', 'Yeti Rambler 20oz Stainless Steel Tumbler', 29.99,  0,  300,'YETI-R20T-CHR', 'Yeti',    4.85, 2345, 5,  TRUE, NOW()),
(38, 'Manduka PRO Yoga Mat', 'Manduka PRO Yoga Mat - Premium 6mm Thick Mat', 120.00, 15, 100,'MAND-PRO-BLK',  'Manduka', 4.80, 890,  14, TRUE, NOW()),
(39, 'Theragun Pro', 'Theragun Pro Handheld Percussive Therapy Device', 499.00, 10, 70, 'THGN-PRO-BLK',  'Theragun',4.68, 456,  14, TRUE, NOW()),
(40, 'Osprey Atmos AG 65 Pack', 'Osprey Atmos AG 65 Mens Backpacking Backpack', 290.00, 0,  40, 'OSPRY-AAG65-M', 'Osprey',  4.88, 567,  5,  TRUE, NOW());

-- More Electronics
INSERT IGNORE INTO products (id, name, description, price, discount_percent, stock_quantity, sku, brand, rating, review_count, category_id, is_active, created_at) VALUES
(41, 'iPad Pro 12.9" M2', 'Apple iPad Pro 12.9-inch M2 chip 256GB Wi-Fi', 1099.99, 0,  45, 'APPL-IPADP-M2',  'Apple',   4.82, 567,  1,  TRUE, NOW()),
(42, 'Amazon Echo Show 10', 'Amazon Echo Show 10 10.1" HD Smart Display with Alexa', 249.99, 20, 80, 'AMZN-ES10-BLK', 'Amazon',  4.40, 890,  1,  TRUE, NOW()),
(43, 'GoPro HERO12 Black', 'GoPro HERO12 Black Action Camera 5.3K60 Video', 399.99, 10, 90, 'GPRO-H12-BLK',  'GoPro',   4.70, 345,  1,  TRUE, NOW()),
(44, 'Sony PlayStation 5', 'Sony PlayStation 5 Console Disc Version', 499.99, 0,  20, 'SONY-PS5-DISC',  'Sony',    4.90, 2345, 1,  TRUE, NOW()),
(45, 'Nintendo Switch OLED', 'Nintendo Switch OLED Model White Set', 349.99, 0,  55, 'NINT-SWO-WHT',   'Nintendo',4.85, 1789, 1,  TRUE, NOW()),
(46, 'Kindle Paperwhite 5', 'Kindle Paperwhite 11th Gen 32GB Waterproof 6.8" Display', 139.99, 0,  200,'AMZN-KPW5-32', 'Amazon',  4.78, 1234, 2,  TRUE, NOW()),
(47, 'Ring Video Doorbell 4', 'Ring Video Doorbell 4 with improved motion detection', 99.99,  25, 150,'RING-VDB4-BLK', 'Ring',    4.55, 678,  1,  TRUE, NOW()),
(48, 'Logitech MX Master 3S', 'Logitech MX Master 3S Advanced Wireless Mouse', 99.99,  0,  180,'LOGI-MXM3S-BLK','Logitech',4.80, 1023, 1,  TRUE, NOW()),
(49, 'Samsung T7 2TB SSD', 'Samsung T7 Portable SSD 2TB USB 3.2 Gen 2', 149.99, 15, 220,'SAMS-T7-2TB',    'Samsung', 4.75, 789,  1,  TRUE, NOW()),
(50, 'Anker 20000mAh PowerBank', 'Anker 737 Power Bank 24000mAh 140W USB-C Charging', 79.99,  5,  300,'ANKR-737-24K',  'Anker',   4.72, 456,  1,  TRUE, NOW());

-- Product Images
INSERT IGNORE INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
(1,  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 'iPhone 15 Pro Max', 0, TRUE),
(2,  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', 'Samsung Galaxy S24', 0, TRUE),
(3,  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', 'Google Pixel 8', 0, TRUE),
(4,  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'MacBook Pro', 0, TRUE),
(5,  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', 'Dell XPS 15', 0, TRUE),
(6,  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', 'ASUS ROG', 0, TRUE),
(7,  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'Sony Headphones', 0, TRUE),
(8,  'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600', 'AirPods Pro', 0, TRUE),
(9,  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'Bose QC45', 0, TRUE),
(10, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', 'Samsung TV', 0, TRUE),
(11, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'Atomic Habits', 0, TRUE),
(23, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'Instant Pot', 0, TRUE),
(33, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'Nike Shoes', 0, TRUE),
(44, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600', 'PlayStation 5', 0, TRUE);

-- Addresses
INSERT IGNORE INTO addresses (id, user_id, street, city, state, zip_code, country, is_default) VALUES
(1, 2, '123 Main St', 'New York', 'NY', '10001', 'United States', TRUE),
(2, 3, '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'United States', TRUE),
(3, 4, '789 Pine Rd', 'Chicago', 'IL', '60601', 'United States', TRUE),
(4, 5, '321 Elm St', 'Houston', 'TX', '77001', 'United States', TRUE),
(5, 6, '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'United States', TRUE);

-- Sample Orders
INSERT IGNORE INTO orders (id, user_id, status, total_amount, shipping_address_id, payment_method, payment_status, created_at, updated_at) VALUES
(1, 2, 'DELIVERED', 1449.98, 1, 'CREDIT_CARD', 'PAID', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY)),
(2, 3, 'SHIPPED',   1099.99, 2, 'PAYPAL',       'PAID', DATE_SUB(NOW(), INTERVAL 5 DAY),  DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 4, 'CONFIRMED', 349.99,  3, 'DEBIT_CARD',   'PAID', DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 5, 'PENDING',   699.99,  4, 'CREDIT_CARD',  'PENDING', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 2, 'CANCELLED', 249.99,  1, 'CREDIT_CARD',  'REFUNDED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));

INSERT IGNORE INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 1199.99),
(1, 8, 1, 249.99),
(2, 2, 1, 1099.99),
(3, 7, 1, 349.99),
(4, 24, 1, 449.99),
(4, 25, 1, 44.99),
(4, 28, 1, 249.99),
(5, 8, 1, 249.99);

-- Sample Reviews
INSERT IGNORE INTO reviews (user_id, product_id, rating, title, body, verified, created_at, updated_at) VALUES
(2, 1, 5, 'Best iPhone ever!', 'The titanium build is incredible. Camera system is top notch. Battery life improved significantly.', TRUE, DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY)),
(3, 7, 5, 'Industry leading ANC', 'Sony continues to dominate the headphone market. Best noise cancellation available.', TRUE, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
(4, 23, 4, 'Great multi-cooker', 'Changed how I cook. Easy to use with amazing results. Slightly tricky to learn at first.', TRUE, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
(5, 11, 5, 'Life changing book', 'This book completely changed how I approach habits. Required reading for everyone.', FALSE, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY)),
(6, 44, 5, 'Worth the wait!', 'PS5 is incredible. The DualSense haptic feedback is a game changer. Load times are super fast.', FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(7, 4,  5, 'Perfect laptop', 'The M3 Pro chip is insanely fast. Battery life is phenomenal. Worth every penny.', FALSE, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Sample Carts
INSERT IGNORE INTO carts (id, user_id, created_at) VALUES
(1, 6, NOW()),
(2, 7, NOW());

INSERT IGNORE INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 5,  1),
(1, 9,  1),
(2, 33, 2),
(2, 36, 1);
