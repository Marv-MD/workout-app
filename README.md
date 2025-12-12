# Hybrid Workout Tracker

This repository contains a monorepo-style setup for a hybrid bodybuilding + calisthenics workout tracker. It includes:

- **mobile/**: Expo React Native app using TypeScript and offline-first SQLite storage.
- **supabase/**: SQL migrations, seeds, and RLS policies for Supabase Postgres.
- **shared/**: Shared TypeScript domain models and validation.

See the instructions below for environment setup, running the app, and managing the database.

## Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`) or `npx expo` for local development
- Supabase CLI for applying migrations locally (optional but recommended)

## Mobile App Setup (Expo)
1. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```
2. Create a `.env` file based on `.env.example` with your Supabase URL and Anon key.
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Use the Expo Go app or an emulator to run the project.

### Project Structure
- `src/navigation` – Tab navigation between core screens (Workout, Skills, History, Settings).
- `src/screens` – UI screens implementing workout logging, skill tree, history, and settings.
- `src/components` – Reusable UI components, including polymorphic set inputs and timers.
- `src/state` – Zustand store for app settings and in-progress workout state.
- `src/data` – Offline-first repositories for SQLite and Supabase sync.
- `src/utils` – Helpers for formatting, validation, and time handling.

## Supabase Setup
1. Copy `.env.example` in `supabase/` to `.env.local` and fill in your project details.
2. Apply migrations using Supabase CLI or psql:
   ```bash
   cd supabase
   supabase db push   # or: psql "$SUPABASE_DB_URL" -f migrations/0001_init.sql
   ```
3. Seed initial exercises and skills:
   ```bash
   psql "$SUPABASE_DB_URL" -f seeds/0001_seed.sql
   ```

The migrations create enums for logging types, core tables, JSONB constraints for set performance, and RLS policies for user-owned data.

## Shared Types
The `shared/` package contains TypeScript models and Zod validation for set performance payloads, used by both the mobile app and backend scripts.

## Sync Model (Overview)
- Local SQLite is the source of truth while offline.
- Mutations are queued in a `sync_queue` table.
- When connectivity is available, the `SyncEngine` pushes local changes to Supabase, then pulls remote updates based on `updated_at` timestamps.
- Conflict resolution: last write wins using `updated_at`. Remote rows are never hard-deleted; soft deletes use `deleted_at`.

## Scripts
- `npm run lint` (mobile) – lint the app code.
- `npm run typecheck` (mobile) – run TypeScript type checking.

## Notes
- This is an MVP implementation with a focus on offline-first logging, polymorphic set inputs, and calisthenics skill progressions.
- Extend the schema and UI as needed for production use.
