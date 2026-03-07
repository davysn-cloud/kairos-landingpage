CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items (session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses (customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);
