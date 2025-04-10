-- Insert Categories
INSERT INTO categories ("Id", "Name", "Description", "IsDeleted", "CreatedAt")
VALUES
('d7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 'Fresh Produce', 'Fresh fruits and vegetables from local farms', false, CURRENT_TIMESTAMP),
('ea55f0d4-cb16-4151-8df0-c7b35e06b301', 'Dairy & Eggs', 'Fresh dairy products and eggs from free-range farms', false, CURRENT_TIMESTAMP),
('9e7a2c5b-5da6-4ff1-a244-5d5c71f91729', 'Bakery', 'Freshly baked artisanal breads and pastries', false, CURRENT_TIMESTAMP),
('42f6d8fc-be48-4b19-bf1d-9c4a823f91c3', 'Meat & Seafood', 'Premium quality meat and fresh seafood', false, CURRENT_TIMESTAMP),
('6c4eb594-838a-4b38-9d27-6a83a1cdc64f', 'Pantry Items', 'Essential pantry items, spices, and cooking ingredients', false, CURRENT_TIMESTAMP);

-- Insert Products with more detailed information
INSERT INTO products ("Id", "Name", "Description", "Price", "StockQuantity", "ImageUrl", "CategoryId", "Rating", "ReviewCount", "IsDeleted", "CreatedAt")
VALUES
-- Fresh Produce
('c1a2b3c4-d5e6-f7a8-b9c0-1a2b3c4d5e6f', 'Organic Apples', 'Fresh organic Honeycrisp apples from Washington state. Sweet, crisp and perfect for snacking or baking.', 3.99, 50, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb', 'd7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 4.8, 32, false, CURRENT_TIMESTAMP),
('d2e3f4a5-b6c7-d8e9-f0a1-b2c3d4e5f6a7', 'Organic Bananas', 'Premium organic bananas, perfectly ripened and ready to eat. High in potassium and great for smoothies.', 1.99, 100, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224', 'd7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 4.7, 56, false, CURRENT_TIMESTAMP),
('e3f4a5b6-c7d8-e9f0-a1b2-c3d4e5f6a7b8', 'Fresh Spinach', 'Locally sourced organic baby spinach. Pre-washed and ready to use in salads, smoothies, or cooked dishes.', 2.49, 30, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 'd7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 4.5, 18, false, CURRENT_TIMESTAMP),
('f4a5b6c7-d8e9-f0a1-b2c3-d4e5f6a7b8c9', 'Hass Avocados', 'Perfectly ripe Hass avocados. Creamy texture and rich flavor, perfect for guacamole or toast.', 2.99, 40, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578', 'd7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 4.9, 45, false, CURRENT_TIMESTAMP),
('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Organic Blueberries', 'Sweet organic blueberries packed with antioxidants. Great for breakfast, baking, or snacking.', 4.99, 25, 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e', 'd7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 4.6, 29, false, CURRENT_TIMESTAMP),
('b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7', 'Organic Carrots', 'Fresh organic carrots, sweet and crunchy. Perfect for snacking, cooking, or juicing.', 2.29, 60, 'https://images.unsplash.com/photo-1582515073490-39981397c445', 'd7a2f2cc-bd19-4de2-9c46-9f211c7d33b6', 4.4, 14, false, CURRENT_TIMESTAMP),

-- Dairy & Eggs
('c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8', 'Organic Whole Milk', 'Farm fresh organic whole milk from grass-fed cows. Rich, creamy, and nutritious.', 4.99, 25, 'https://images.unsplash.com/photo-1550583724-b2692b85b150', 'ea55f0d4-cb16-4151-8df0-c7b35e06b301', 4.6, 38, false, CURRENT_TIMESTAMP),
('d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9', 'Free-Range Eggs', 'Dozen free-range eggs from local family farms. Fresh, nutritious, and ethically produced.', 5.49, 40, 'https://images.unsplash.com/photo-1518569656728-22b11afee2cb', 'ea55f0d4-cb16-4151-8df0-c7b35e06b301', 4.9, 62, false, CURRENT_TIMESTAMP),
('e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', 'Greek Yogurt', 'Plain Greek yogurt, high in protein with a thick, creamy texture. Perfect for breakfast or cooking.', 3.99, 30, 'https://images.unsplash.com/photo-1488477181946-6428a0291777', 'ea55f0d4-cb16-4151-8df0-c7b35e06b301', 4.7, 41, false, CURRENT_TIMESTAMP),
('f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', 'Artisan Cheddar Cheese', 'Aged artisan cheddar cheese, sharp and flavorful. Made from local milk with traditional methods.', 6.99, 20, 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d', 'ea55f0d4-cb16-4151-8df0-c7b35e06b301', 4.8, 27, false, CURRENT_TIMESTAMP),

-- Bakery
('a7b8c9d0-e1f2-a3b4-c5d6-e7f8a9b0c1d2', 'Sourdough Bread', 'Artisanal sourdough bread with a crispy crust and chewy interior. Freshly baked daily.', 4.99, 15, 'https://images.unsplash.com/photo-1604934636847-933418a8ecd0', '9e7a2c5b-5da6-4ff1-a244-5d5c71f91729', 4.7, 33, false, CURRENT_TIMESTAMP),
('b8c9d0e1-f2a3-b4c5-d6e7-f8a9b0c1d2e3', 'Multigrain Bread', 'Nutritious multigrain bread packed with seeds and whole grains. High in fiber and protein.', 3.99, 20, 'https://images.unsplash.com/photo-1590301157890-4810ed352733', '9e7a2c5b-5da6-4ff1-a244-5d5c71f91729', 4.5, 19, false, CURRENT_TIMESTAMP),
('c9d0e1f2-a3b4-c5d6-e7f8-a9b0c1d2e3f4', 'Chocolate Croissants', 'Flaky, buttery croissants filled with rich dark chocolate. Perfect with coffee for breakfast or dessert.', 2.99, 25, 'https://images.unsplash.com/photo-1550576087-9e86983e7a83', '9e7a2c5b-5da6-4ff1-a244-5d5c71f91729', 4.8, 52, false, CURRENT_TIMESTAMP),
('d0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5', 'Cinnamon Rolls', 'Freshly baked cinnamon rolls with cream cheese frosting. Soft, gooey, and perfectly spiced.', 3.49, 18, 'https://images.unsplash.com/photo-1538203580460-1d9c2ccce651', '9e7a2c5b-5da6-4ff1-a244-5d5c71f91729', 4.9, 47, false, CURRENT_TIMESTAMP),

-- Meat & Seafood
('e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6', 'Grass-Fed Ground Beef', 'Premium grass-fed ground beef, 1lb. Lean, flavorful, and sustainably raised with no antibiotics.', 7.99, 20, 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f', '42f6d8fc-be48-4b19-bf1d-9c4a823f91c3', 4.6, 24, false, CURRENT_TIMESTAMP),
('f2a3b4c5-d6e7-f8a9-b0c1-d2e3f4a5b6c7', 'Atlantic Salmon Fillet', 'Fresh Atlantic salmon fillet, 1lb. Rich in omega-3s, perfect for grilling or baking.', 12.99, 15, 'https://images.unsplash.com/photo-1599084993063-bc065179ea71', '42f6d8fc-be48-4b19-bf1d-9c4a823f91c3', 4.8, 31, false, CURRENT_TIMESTAMP),
('a3b4c5d6-e7f8-a9b0-c1d2-e3f4a5b6c7d8', 'Organic Chicken Breast', 'Boneless, skinless organic chicken breast, 1lb. Free-range, antibiotic-free, and air-chilled.', 6.99, 25, 'https://images.unsplash.com/photo-1518492104633-130d0cc84637', '42f6d8fc-be48-4b19-bf1d-9c4a823f91c3', 4.7, 39, false, CURRENT_TIMESTAMP),
('b4c5d6e7-f8a9-b0c1-d2e3-f4a5b6c7d8e9', 'Wild-Caught Shrimp', 'Wild-caught jumbo shrimp, 1lb. Sustainable and perfect for grilling, pasta dishes, or stir-fries.', 13.99, 18, 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b', '42f6d8fc-be48-4b19-bf1d-9c4a823f91c3', 4.6, 22, false, CURRENT_TIMESTAMP),

-- Pantry Items
('c5d6e7f8-a9b0-c1d2-e3f4-a5b6c7d8e9f0', 'Extra Virgin Olive Oil', 'Cold-pressed extra virgin olive oil from Italian olives, 500ml. Rich flavor perfect for cooking and dressing.', 9.99, 35, 'https://images.unsplash.com/photo-1528825593757-2976ac8255a7', '6c4eb594-838a-4b38-9d27-6a83a1cdc64f', 4.8, 36, false, CURRENT_TIMESTAMP),
('d6e7f8a9-b0c1-d2e3-f4a5-b6c7d8e9f0a1', 'Organic Quinoa', 'Organic white quinoa, 1lb. High in protein and a complete grain with all essential amino acids.', 5.99, 40, 'https://images.unsplash.com/photo-1586201375761-83865001e8ac', '6c4eb594-838a-4b38-9d27-6a83a1cdc64f', 4.5, 28, false, CURRENT_TIMESTAMP),
('e7f8a9b0-c1d2-e3f4-a5b6-c7d8e9f0a1b2', 'Raw Honey', 'Local raw honey, 12oz. Unfiltered, unpasteurized, and full of natural enzymes and antioxidants.', 8.99, 30, 'https://images.unsplash.com/photo-1555211652-5c6222f971ca', '6c4eb594-838a-4b38-9d27-6a83a1cdc64f', 4.9, 42, false, CURRENT_TIMESTAMP),
('f8a9b0c1-d2e3-f4a5-b6c7-d8e9f0a1b2c3', 'Himalayan Pink Salt', 'Pure Himalayan pink salt, 8oz. Rich in minerals with a delicate flavor that enhances any dish.', 4.49, 45, 'https://images.unsplash.com/photo-1526434678267-61e3f46e0a16', '6c4eb594-838a-4b38-9d27-6a83a1cdc64f', 4.6, 17, false, CURRENT_TIMESTAMP),
('a9b0c1d2-e3f4-a5b6-c7d8-e9f0a1b2c3d4', 'Organic Coconut Oil', 'Cold-pressed organic virgin coconut oil, 16oz. Perfect for cooking, baking, or beauty applications.', 7.99, 28, 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d', '6c4eb594-838a-4b38-9d27-6a83a1cdc64f', 4.7, 23, false, CURRENT_TIMESTAMP); 