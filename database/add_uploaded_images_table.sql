CREATE TABLE IF NOT EXISTS uploaded_images (
  id BIGSERIAL PRIMARY KEY,
  original_name VARCHAR(255),
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
