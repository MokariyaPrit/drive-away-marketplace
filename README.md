
# Drive Away Marketplace

A modern car marketplace application built with React (frontend) and NestJS (backend).

## Project Structure

This repository contains both frontend and backend code:

- **Frontend**: React application built with Vite, TypeScript, and Tailwind CSS
- **Backend**: NestJS application with PostgreSQL database (in the `NestJs_backend` folder)

## Frontend Dependencies

The frontend application uses the following major dependencies:

- React 18
- React Router 6
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Tanstack React Query
- Recharts (for charts and visualizations)
- Lucide React (for icons)
- React Hook Form (for form handling)
- Zod (for schema validation)

### Frontend Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend Dependencies

The backend NestJS application uses the following major dependencies:

- NestJS 10
- TypeORM (for database access)
- PostgreSQL (database)
- Passport.js (for authentication)
- JWT (for token-based authentication)
- bcrypt (for password hashing)
- class-validator (for DTO validation)
- Swagger (for API documentation)

See the [NestJs_backend/README.md](./NestJs_backend/README.md) for detailed backend setup instructions.

## Development

For local development, you'll need to run both the frontend and backend servers:

1. Start the backend server (see backend README)
2. Start the frontend development server
3. The frontend will communicate with the backend API

## Environment Setup

The frontend expects the backend API URL to be provided as an environment variable:

```
VITE_API_URL=http://localhost:3000/api
```

For production deployments, update this URL to point to your deployed backend API.
