# Backend Setup

## Install
```bash
pnpm install
```

## Environment Variables
Create `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
AUTH_SECRET="your-secret-key-min-32-chars"
AUTH_URL="http://localhost:3000"
RESEND_KEY="your-resend-api-key"
LOG_LEVEL="info"
PORT=8080
```

## Database
```bash
pnpm run db:push
```

## Run
Development:
```bash
pnpm run dev
```

Production:
```bash
pnpm run build
pnpm start
```

## API Docs
```
http://localhost:8080/scalar
```
