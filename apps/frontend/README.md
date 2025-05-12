# Creditable

Creditable is a web application that helps insurance brokers evaluate and determine Medicare Part D creditability for employer-sponsored health plans.

## Features

- Secure user authentication (signup, login)
- Broker and client health plan management
- Rule engine for creditability determination (simplified & actuarial)
- Responsive UI with light/dark theme support
- Built with a modern TypeScript stack

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Express, TypeScript, Prisma, PostgreSQL
- Auth: JWT-based authentication
- Deployment: [To be determined]

## Development

### Getting Started

1. Clone the repo
2. Install dependencies

```bash
  pnpm install
```

3. Start the development server

```bash
  pnpm dev
```

#### Backend Setup

1. Navigate to the backend directory
2. Configure environment variables (.env)
3. Run database migrations

```bash
pnpm exec prisma migrate dev
```

4. Start the backend server

```bash
  pnpm dev
```
