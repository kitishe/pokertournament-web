# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server  
npm start

# Run linter
npm run lint
```

## Architecture Overview

This is a Next.js 15 App Router application for tracking and analyzing poker tournament results, using Supabase as the database backend.

### Key Components Structure

- **App Router Pages**: Uses Next.js 15 App Router with dynamic routes
  - `/` - Group ID entry form
  - `/group/[groupId]` - Tournament list for a group
  - `/tournament/[tournamentId]` - Individual tournament details
  - `/analytics/[groupId]` - Analytics dashboard

- **Database Layer** (`src/lib/`)
  - `services.ts` - All Supabase queries and data fetching functions
  - `database.types.ts` - Auto-generated TypeScript types from Supabase schema
  - `supabase.ts` - Supabase client configuration
  - `analytics.ts` - Player statistics calculation functions

- **UI Components** (`src/components/ui/`)
  - Custom UI components: `button.tsx`, `card.tsx`, `input.tsx`, `table.tsx`

### Database Schema

The Supabase database has four main tables:
- `groups` - Tournament groups (id, code, name, pin_hash)
- `tournaments` - Individual tournaments with buy-ins, prize pools, payouts
- `participants` - Tournament participants with results (place, winnings)
- `known_names` - Auto-completion for player names

### Data Flow Architecture

1. **Group Access**: Users enter group code → fetch group by code → redirect to group page
2. **Tournament List**: Display tournaments for group, sorted by creation date
3. **Tournament Details**: Show participants, places, and payouts for specific tournament
4. **Analytics**: Calculate complex statistics across all group tournaments

### Environment Configuration

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Styling System

- Uses Tailwind CSS with custom utility classes
- Custom design system classes like `dashboard-card`, `dashboard-btn-primary`
- Responsive design optimized for both desktop and mobile

### Analytics Features

The analytics system (`analytics.ts`) provides:
- Player statistics calculation with profit/loss tracking
- Tournament participation analysis  
- "Лудики" analysis (players who spent more than they won)
- Prize pool and tournament size statistics

### Type Safety

Full TypeScript integration with:
- Auto-generated database types from Supabase
- Strict typing for all data operations
- Type exports for Group, Tournament, and Participant entities