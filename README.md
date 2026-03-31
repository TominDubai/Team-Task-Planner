# Formed Design — Team Target Planner

A high-end, real-time team progress tracking app built for **Formed Design** studio.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Syne / DM Sans fonts |
| Icons | Lucide React |
| Backend | Supabase (Auth + Postgres + Realtime) |
| Animation | Framer Motion |
| Celebrations | Canvas Confetti |
| Notifications | React Hot Toast |

## Features

### `/dashboard` — Individual Space
- Personal Daily / Weekly / Monthly task columns
- Animated SVG progress rings per task
- Drag-slider to update `actual_value` in real-time
- Status override (Pending → In Progress → Complete → At Risk)
- **Vibe Check** — select 🚀 ☕ 🐢 which broadcasts your status to the whole team instantly
- **Canvas confetti** burst when a Monthly Target hits 100%

### `/team` — Collective Pulse
- Grid of member cards with circular SVG progress rings
- Live vibe emoji per person
- **Supabase Realtime subscriptions** — rings animate immediately when a colleague saves progress (no refresh needed)
- Live update counter indicator
- Team-level stats bar

### `/admin` — Manager Portal *(admin role only)*
- High-level staff table with Daily / Weekly / Monthly % columns
- Sortable columns
- At-Risk task panel with highlighted overdue items
- **High-Five** button — sends a toast notification celebrating team members

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.local.example .env.local
```
Fill in your Supabase project URL and anon key from [supabase.com](https://supabase.com).

### 3. Run the Supabase schema
Open your Supabase project → **SQL Editor** → paste and run `supabase/schema.sql`.

This will create:
- `profiles` table (auto-populated on signup via trigger)
- `tasks` table
- Row Level Security policies
- Real-time publication for both tables

### 4. Set the first admin
After signing up, run in Supabase SQL Editor:
```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```

### 5. Start dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

```
profiles
  id          uuid (FK → auth.users)
  full_name   text
  avatar_url  text
  current_vibe text  ('🚀' | '☕' | '🐢')
  role        text  ('member' | 'admin')

tasks
  id            uuid
  user_id       uuid (FK → profiles)
  title         text
  timeframe     text  ('daily' | 'weekly' | 'monthly')
  target_value  numeric
  actual_value  numeric
  status        text  ('pending' | 'in_progress' | 'complete' | 'at_risk')
  due_date      date
```

## Design System

- **Background:** `#121212` deep charcoal
- **Primary accent:** `#00B4FF` electric blue
- **Success:** `#00E5A0` emerald
- **Warning:** `#F5A623` amber
- **Danger:** `#FF4D6A` rose
- **Cards:** Glassmorphism (`rgba(255,255,255,0.04)` + `backdrop-blur`)
- **Grid:** 4pt spacing system
- **Display font:** [Syne](https://fonts.google.com/specimen/Syne)
- **Body font:** [DM Sans](https://fonts.google.com/specimen/DM+Sans)

## Folder Structure

```
app/
  auth/login/         # Login & signup page
  auth/callback/      # Supabase OAuth callback
  dashboard/          # Individual space
  team/               # Collective pulse
  admin/              # Manager portal
components/
  layout/             # Sidebar, AppShell
  dashboard/          # TaskCard, TaskColumn
  team/               # MemberCard
  admin/              # HighFiveButton
  ui/                 # GlassCard, ProgressRing, VibeCheck, ConfettiCelebration, TaskFormModal
lib/
  supabase/           # Browser + server clients
  types.ts            # All TypeScript types
  utils.ts            # Helpers
supabase/
  schema.sql          # Full DB schema to run in Supabase
```
