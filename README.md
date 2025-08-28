# Poker Tournament Tracker

A Next.js web application for observing and analyzing poker tournament results.

## Features

- **Group Entry**: Enter a group ID to access tournament data
- **Tournament List**: View all tournaments with dates and buy-ins
- **Tournament Details**: Detailed view showing winners, payouts, and statistics
- **Analytics Dashboard**: Comprehensive analytics including:
  - Players with most paid places
  - Most active players
  - "Лудики" (players who spent more but won less)
  - Most visited tournaments
  - Biggest prize pools

## Setup

1. **Environment Variables**
   
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses Supabase with the following tables:
- `groups` - Tournament groups
- `tournaments` - Individual tournaments
- `participants` - Tournament participants and results
- `known_names` - Known player names for auto-completion

## Deployment

This app is configured for deployment on Vercel. Push to your connected GitHub repository to trigger automatic deployments.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **Date Handling**: date-fns