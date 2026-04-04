# ACT Therapy App — Acceptance and Commitment Therapy Exercises

Always proceed without asking for confirmation. Never pause to ask "should I?" — just do it.

## What This Is

An interactive web app for practicing Acceptance and Commitment Therapy (ACT). Features 20+ guided exercises across all six ACT core processes, user authentication, progress tracking, and a personal values/action planning system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite via Prisma ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |

## Project Structure

```
act-therapy-app/
├── client/
│   ├── src/
│   │   ├── pages/              # Dashboard, Progress, Hexaflex, etc.
│   │   │   └── exercises/      # 20+ exercise components
│   │   ├── components/         # Layout, Toast, FavoriteButton
│   │   ├── hooks/useToast.ts
│   │   ├── App.tsx             # 50+ routes
│   │   └── main.tsx
│   └── vite.config.ts          # Proxies /api → localhost:5001
├── server/
│   ├── src/
│   │   ├── routes/             # auth, progress, values, actions, favorites, exerciseData
│   │   ├── middleware/auth.ts  # JWT verification
│   │   └── index.ts            # Express setup
│   ├── prisma/schema.prisma    # User, Progress, Value, Action, Favorite, ExerciseData
│   └── .env                    # PORT, JWT_SECRET, DATABASE_URL
└── package.json                # Root scripts
```

## Development Commands

```bash
# Install everything
npm run install:all

# Database setup (first time)
cd server && npm run db:push && cd ..

# Run both client + server
npm run dev
# Or separately:
npm run dev:client    # Frontend: http://localhost:3000
npm run dev:server    # Backend: http://localhost:5001

# Build
npm run build

# Database tools
cd server
npm run db:studio     # Prisma GUI
npm run db:push       # Sync schema changes
```

## Environment

Server env (`server/.env`):
- `PORT=5001`
- `JWT_SECRET=your-secret` (change in production)
- `DATABASE_URL=file:./dev.db`
- `NODE_ENV=development`

## Key Details

- **Frontend proxying**: Vite proxies `/api/*` to backend at localhost:5001
- **JWT tokens**: 7-day expiry, stored in localStorage on client
- **Passwords**: bcryptjs with 10 salt rounds
- **Database**: SQLite file at `server/dev.db` (Prisma manages migrations)
- **ACT exercises**: Each is a standalone component in `client/src/pages/exercises/`
- **Custom Tailwind colors**: electric-blue, brand-pink, lime-green, midnight-purple, inferno-red
