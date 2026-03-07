CREATE TABLE IF NOT EXISTS "order_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" varchar NOT NULL REFERENCES "orders"("id"),
  "author_name" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_notes_order ON order_notes (order_id);
