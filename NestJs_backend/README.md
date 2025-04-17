
# Drive Away - NestJS Backend

This is the NestJS backend for the Drive Away car marketplace application.

## Features

- User authentication (login, registration) with JWT
- Role-based access control (admin, manager, user)
- Car listings management
- Test drive request handling
- Car submission and approval workflow

## Technology Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js, JWT
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Security**: bcrypt for password hashing

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v13+)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory
```bash
cd NestJs_backend
```
3. Install dependencies
```bash
npm install
```

## Dependencies List

### Main Dependencies

```
@nestjs/common: ^10.0.0
@nestjs/config: ^3.1.1
@nestjs/core: ^10.0.0
@nestjs/jwt: ^10.2.0
@nestjs/passport: ^10.0.3
@nestjs/platform-express: ^10.0.0
@nestjs/swagger: ^7.3.0
@nestjs/typeorm: ^10.0.1
bcrypt: ^5.1.1
class-transformer: ^0.5.1
class-validator: ^0.14.1
passport: ^0.7.0
passport-jwt: ^4.0.1
passport-local: ^1.0.0
pg: ^8.11.3
reflect-metadata: ^0.1.13
rxjs: ^7.8.1
typeorm: ^0.3.20
```

### Development Dependencies

```
@nestjs/cli: ^10.0.0
@nestjs/schematics: ^10.0.0
@nestjs/testing: ^10.0.0
@types/bcrypt: ^5.0.2
@types/express: ^4.17.17
@types/jest: ^29.5.2
@types/node: ^20.3.1
@types/passport-jwt: ^4.0.1
@types/passport-local: ^1.0.38
@types/supertest: ^2.0.12
@typescript-eslint/eslint-plugin: ^6.0.0
@typescript-eslint/parser: ^6.0.0
eslint: ^8.42.0
eslint-config-prettier: ^9.0.0
eslint-plugin-prettier: ^5.0.0
jest: ^29.5.0
prettier: ^3.0.0
source-map-support: ^0.5.21
supertest: ^6.3.3
ts-jest: ^29.1.0
ts-loader: ^9.4.3
ts-node: ^10.9.1
tsconfig-paths: ^4.2.0
typescript: ^5.1.3
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=drive_away
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the application is running, Swagger API documentation is available at:
```
http://localhost:3000/api/docs
```

## Database Migrations

```bash
# Generate migration
npm run typeorm:generate-migration -- -n MigrationName

# Run migrations
npm run typeorm:run-migrations
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

- **src/auth**: Authentication module (strategies, guards)
- **src/users**: User entity and management
- **src/cars**: Car listings
- **src/test-drive-requests**: Test drive request handling
- **src/car-submissions**: Car submission and approval workflow

## Common Issues

### TypeScript Decorator Errors

If you encounter errors like:
```
Unable to resolve signature of property decorator when called as an expression
```

Make sure your `tsconfig.json` has these settings:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Also ensure that all decorators have proper argument objects (not undefined).
