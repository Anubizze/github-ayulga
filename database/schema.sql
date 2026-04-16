CREATE TYPE user_role AS ENUM ('admin', 'editor');
CREATE TYPE calculator_field_type AS ENUM ('input', 'select', 'number');
CREATE TYPE setting_type AS ENUM ('text', 'textarea', 'json');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id BIGSERIAL PRIMARY KEY,
  title_kz VARCHAR(255) NOT NULL,
  title_ru VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  parent_id BIGINT NULL REFERENCES menu_items(id) ON DELETE SET NULL,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pages (
  id BIGSERIAL PRIMARY KEY,
  title_kz VARCHAR(255) NOT NULL,
  title_ru VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content_kz TEXT,
  content_ru TEXT,
  meta_title_kz VARCHAR(255),
  meta_title_ru VARCHAR(255),
  meta_description_kz TEXT,
  meta_description_ru TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title_kz VARCHAR(255) NOT NULL,
  title_ru VARCHAR(255) NOT NULL,
  content_kz TEXT,
  content_ru TEXT,
  excerpt_kz TEXT,
  excerpt_ru TEXT,
  image VARCHAR(255),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE uploaded_images (
  id BIGSERIAL PRIMARY KEY,
  original_name VARCHAR(255),
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE specialists (
  id BIGSERIAL PRIMARY KEY,
  name_kz VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  specialization_kz VARCHAR(255),
  specialization_ru VARCHAR(255),
  photo VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE calculator_settings (
  id BIGSERIAL PRIMARY KEY,
  field_name VARCHAR(100) NOT NULL,
  field_label_kz VARCHAR(255) NOT NULL,
  field_label_ru VARCHAR(255) NOT NULL,
  field_type calculator_field_type DEFAULT 'input',
  default_value VARCHAR(100),
  is_required BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  language VARCHAR(2) DEFAULT 'kz',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type setting_type DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@auylga.kz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (username) DO NOTHING;
