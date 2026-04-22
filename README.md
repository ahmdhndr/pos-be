# Multi-Tenant POS API (Backend)

The core engine of the Multi-tenant Point of Sale system. Built with NestJS, PostgreSQL, and Clean Architecture principles to ensure scalability and high testability.

## Architecture Overview

This project follows Clean Architecture. The goal is to keep the business logic (Domain) independent of external frameworks and databases.

`src/domain`: Pure business logic (Entities, Repository interfaces, Logic). No NestJS decorators here.

`src/application`: Use cases and service orchestration.

`src/infrastructure`: Concrete implementations (TypeORM, Identity/Tenant resolution, Mailer).

`src/interface`: The HTTP layer (Controllers, DTOs, Guards, Filters).

## Tech Stack

- Framework: NestJS
- Validation: class-validator (Integrated with Swagger)
- API Documentation: Swagger (OpenAPI 3.0)
- Testing: Jest (Unit/Integration)

## Getting Started

1. Prerequisites

- Node.js (v20+)
- pnpm (v8+)
- Docker (for local Database)

1. Installation

```bash
pnpm install
```

1. Environment Setup
   Copy the `.env.example` to `.env` and update your database credentials.

```bash
cp .env.example .env
```

1. Running the Project

```bash
# Start Docker (PostgreSQL)
docker-compose up -d

# Start Development mode
pnpm run start:dev
```

> The API will be available at: <http://localhost:3000/api>
> The Swagger docs: <http://localhost:3000/docs>

## Multi-Tenancy Strategy

This system uses a Schema-per-Tenant approach.

1. Identification: The TenantMiddleware extracts the tenant identifier from the X-Tenant-ID header or the subdomain.

2. Isolation: Database connections are dynamically switched at the request level to ensure data isolation.

## Testing (TDD Approach)

Follow the Red-Green-Refactor cycle.

```bash
# Run unit tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Generate coverage report
pnpm run test:cov
```

## Key Principles for this Project

- Stay in the `Layer`: Don't import `TypeORM entities` into the `domain/logic`. Use interfaces.
- TDD First: Write the test for business logic in domain/ before the implementation.
- Keep it Simple: For simple CRUD, it's okay to have a "thin" application layer.
