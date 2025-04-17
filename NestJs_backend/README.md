
# Drive Away - NestJS Backend

This repository contains the NestJS backend for the Drive Away car marketplace application.

## Setup Instructions

1. Clone this repository
2. Install dependencies: `npm install`
3. Configure PostgreSQL connection in `.env` file
4. Run the development server: `npm run start:dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=drive_away
JWT_SECRET=your_jwt_secret
```

## API Documentation

Once running, API documentation is available at `/api/docs`
