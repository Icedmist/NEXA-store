-- Nexa Store OS - Database Schema
-- Paste this into your Supabase SQL Editor to initialize the database

-- 1. Create Tables

-- Stores
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  code TEXT UNIQUE,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  revenue NUMERIC DEFAULT 0,
  transactions INT DEFAULT 0,
  manager_id TEXT
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  stock INT NOT NULL,
  low_stock_threshold INT DEFAULT 10,
  qr_code TEXT UNIQUE,
  image TEXT
);

-- Staff Members (Can be profiles referencing auth.users in production)
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('admin', 'manager', 'staff')) DEFAULT 'staff',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  initials TEXT,
  store_id TEXT REFERENCES stores(id) ON DELETE SET NULL,
  password_hash TEXT
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  items JSONB, -- Array of items {name, qty, price}
  total NUMERIC NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  cashier TEXT
);

-- Activities / Notifications
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  store TEXT,
  action TEXT NOT NULL,
  user_name TEXT,
  time TIMESTAMPTZ DEFAULT NOW(),
  type TEXT
);

