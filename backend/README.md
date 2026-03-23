# CosplayCollabs backend

## Database migrations

Run SQL in `migrations/` against your Postgres/Neon database when noted in release notes.

- **`migrations/add_about_me.sql`** — adds `users.about_me` (VARCHAR 200) for profile bios.
