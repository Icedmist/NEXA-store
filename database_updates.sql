-- Run these SQL updates in your Supabase SQL Editor to apply fixes

-- 1. Add missing parent_store_id to stores to fix branch association bugs.
ALTER TABLE stores ADD COLUMN IF NOT EXISTS parent_store_id TEXT REFERENCES stores(id) ON DELETE SET NULL;

-- 2. Add store_id to activities to fix Global Activity Feed privacy leaks.
ALTER TABLE activities ADD COLUMN IF NOT EXISTS store_id TEXT REFERENCES stores(id) ON DELETE SET NULL;

-- 3. Update existing activities to have a store_id based on store names, as much as possible automatically.
UPDATE activities
SET store_id = stores.id
FROM stores
WHERE activities.store = stores.name AND activities.store_id IS NULL;

-- 4. Add store_id to transactions to prevent cross-store access leaks, just to be safe.
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS store_id TEXT REFERENCES stores(id) ON DELETE SET NULL;
