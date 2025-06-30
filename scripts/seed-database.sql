-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES
('cat1', 'Go''sht mahsulotlari', 'Turli xil go''sht mahsulotlari'),
('cat2', 'Sut mahsulotlari', 'Sut va sut mahsulotlari'),
('cat3', 'Meva va sabzavotlar', 'Yangi meva va sabzavotlar');

-- Insert sample subcategories
INSERT INTO sub_categories (id, name, description, "categoryId") VALUES
('sub1', 'Mol go''shti', 'Mol go''shti mahsulotlari', 'cat1'),
('sub2', 'Tovuq go''shti', 'Tovuq go''shti mahsulotlari', 'cat1'),
('sub3', 'Pishloq', 'Turli xil pishloqlar', 'cat2'),
('sub4', 'Yogurt', 'Yogurt mahsulotlari', 'cat2');

-- Insert sample products
INSERT INTO products (id, name, description, price, "stockQuantity", images, "categoryId", "subCategoryId") VALUES
('prod1', 'Premium Mol Go''shti', 'Yuqori sifatli mol go''shti', 45000, 50, ARRAY['/images/beef1.jpg', '/images/beef2.jpg'], 'cat1', 'sub1'),
('prod2', 'Organik Tovuq Go''shti', 'Organik tovuq go''shti', 25000, 30, ARRAY['/images/chicken1.jpg'], 'cat1', 'sub2'),
('prod3', 'Holland Pishloq', 'Import Holland pishloq', 35000, 20, ARRAY['/images/cheese1.jpg'], 'cat2', 'sub3'),
('prod4', 'Tabiiy Yogurt', 'Tabiiy yogurt 500ml', 8000, 100, ARRAY['/images/yogurt1.jpg'], 'cat2', 'sub4');
