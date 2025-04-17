
# Drive Away - NestJS Backend Setup

This document provides guidance for setting up a NestJS backend for the Drive Away car marketplace application.

## Project Structure

The recommended structure for your NestJS backend:

```
drive-away-backend/
├── src/
│   ├── main.ts                  # Entry point
│   ├── app.module.ts            # Root module
│   ├── auth/                    # Authentication related files
│   ├── cars/                    # Car listings related files
│   ├── test-drive-requests/     # Test drive requests module
│   ├── car-submissions/         # Car submission requests module
│   ├── users/                   # User management module
│   ├── common/                  # Shared utilities and helpers
│   └── config/                  # Configuration files
├── test/                        # Test files
├── nest-cli.json                # NestJS CLI configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── .env                         # Environment variables (not in git)
```

## Getting Started

1. Create a new NestJS project:

```bash
npm i -g @nestjs/cli
nest new drive-away-backend
cd drive-away-backend
```

2. Install PostgreSQL related packages:

```bash
npm install @nestjs/typeorm typeorm pg
```

3. Set up TypeORM in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'drive_away'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    // Your modules here
  ],
})
export class AppModule {}
```

4. Create required modules:

```bash
nest g module cars
nest g module test-drive-requests
nest g module car-submissions
nest g module users
nest g module auth
```

5. Create entities corresponding to your frontend types.

## API Endpoints to Implement

Based on your frontend code, implement these API endpoints:

### Test Drive Requests

```
GET    /api/test-drive-requests/manager      # Get all requests for a manager
PUT    /api/test-drive-requests/:id/approve  # Approve a request
PUT    /api/test-drive-requests/:id/reject   # Reject a request
POST   /api/test-drive-requests/:id/message  # Send a message about a request
```

### Car Submissions

```
GET    /api/car-submissions                  # Get all car submissions
POST   /api/car-submissions                  # Submit a new car
PUT    /api/car-submissions/:id/approve      # Approve a submission
PUT    /api/car-submissions/:id/reject       # Reject a submission
```

### Authentication

```
POST   /api/auth/register                    # Register a new user
POST   /api/auth/login                       # Login a user
POST   /api/auth/logout                      # Logout a user
GET    /api/auth/me                          # Get current user
```

## Running the Backend

1. Create a `.env` file with your database configuration:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=drive_away
```

2. Start the development server:

```bash
npm run start:dev
```

## Connecting Frontend to Backend

In your frontend React application, use the API client service to connect to your NestJS backend endpoints. Update the `API_URL` in `apiClient.ts` to point to your NestJS server.

## Deployment

For production deployment:

1. Build the application:
```bash
npm run build
```

2. Set up a production database
3. Configure environment variables in your hosting service
4. Deploy the compiled code from the `dist/` directory

Recommended hosting options:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Render
- Railway
