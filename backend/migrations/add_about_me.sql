-- Run against your Neon/Postgres database (e.g. SQL Editor in Neon dashboard).
ALTER TABLE users
ADD COLUMN IF NOT EXISTS about_me VARCHAR(200);

COMMENT ON COLUMN users.about_me IS 'Public profile bio; max 200 characters enforced in API.';
