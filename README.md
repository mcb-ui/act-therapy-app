# ACT Therapy Interactive Tool

A comprehensive web-based interactive tool for practicing Acceptance and Commitment Therapy (ACT). This application helps users develop psychological flexibility through guided exercises based on the six core ACT processes.

## Features

### Core ACT Exercises

1. **Values Clarification**
   - Identify and explore personal values across life domains
   - Rate importance and current alignment
   - Track values over time

2. **Cognitive Defusion**
   - 6 interactive defusion techniques
   - Transform relationship with difficult thoughts
   - Practice seeing thoughts as mental events

3. **Present Moment Awareness**
   - Guided mindfulness exercises
   - Breathing meditation with visual guide
   - 5 senses grounding exercise
   - Body scan meditation
   - Built-in timer for practice tracking

4. **Acceptance**
   - Step-by-step acceptance exercise
   - ACT metaphors (Quicksand, Beach Ball, Unwanted Guest)
   - Willingness practice
   - Track resistance and willingness levels

5. **Committed Action**
   - Create and manage values-aligned actions
   - Link actions to specific values
   - Set due dates and track completion
   - View active and completed actions

6. **ACT Hexaflex Visualization**
   - Interactive hexaflex diagram
   - Learn about all six ACT processes
   - Navigate directly to exercises

### Additional Features

- User authentication (register/login)
- Progress tracking for all exercises
- Personal dashboard
- Responsive design for mobile and desktop
- Clean, modern UI with Tailwind CSS

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT authentication
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd act-therapy-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   ```bash
   cd server
   npm run db:push
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env
   cd ..
   ```
   - Edit `server/.env` and change `JWT_SECRET` to a secure random string
   - For production, generate a strong secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Usage

1. **Register an account** - Create your account on the registration page
2. **Explore the dashboard** - View all available exercises
3. **Try different exercises** - Each exercise is interactive and self-guided
4. **Track your progress** - Your data is saved automatically
5. **Learn about ACT** - Visit the Hexaflex page to understand the ACT model

## Project Structure

```
act-therapy-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components (Layout, etc.)
│   │   ├── pages/         # Page components
│   │   │   ├── exercises/ # Exercise pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Hexaflex.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Backend Node.js application
│   ├── prisma/           # Database schema
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── index.ts      # Server entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Progress (Protected)
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Save exercise progress

### Values (Protected)
- `GET /api/values` - Get user values
- `POST /api/values` - Create value
- `PUT /api/values/:id` - Update value
- `DELETE /api/values/:id` - Delete value

### Actions (Protected)
- `GET /api/actions` - Get user actions
- `POST /api/actions` - Create action
- `PUT /api/actions/:id` - Update action
- `DELETE /api/actions/:id` - Delete action

## Development

### Frontend Development
```bash
cd client
npm run dev
```

### Backend Development
```bash
cd server
npm run dev
```

### Database Management
```bash
cd server
npm run db:studio  # Open Prisma Studio
npm run db:push    # Push schema changes
```

### Build for Production
```bash
npm run build      # Build both frontend and backend
```

## About ACT

Acceptance and Commitment Therapy (ACT) is an evidence-based psychological intervention that uses acceptance and mindfulness strategies, together with commitment and behavior change strategies, to increase psychological flexibility.

The six core processes are:
1. **Acceptance** - Making room for difficult experiences
2. **Cognitive Defusion** - Changing relationship with thoughts
3. **Present Moment** - Flexible awareness of here and now
4. **Self-as-Context** - The observing self
5. **Values** - Chosen life directions
6. **Committed Action** - Values-guided behavior

## Contributing

This is an educational tool. Contributions are welcome to improve exercises, add new features, or enhance the user experience.

## Disclaimer

This application is for educational and self-help purposes only. It is not a replacement for professional mental health treatment. If you're experiencing mental health difficulties, please consult with a qualified mental health professional.

## License

MIT License - feel free to use this project for learning and personal use.

## Acknowledgments

Built with modern web technologies and based on ACT principles developed by Steven C. Hayes, Kelly G. Wilson, and Kirk Strosahl.
