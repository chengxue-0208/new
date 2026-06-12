# VPN Backend Service Startup Guide

## Overview

This guide provides instructions for starting, running, and managing the VPN backend service.

## Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database running on localhost:5432
- Redis running on localhost:6379 (optional)

## Configuration

Set the following environment variables:

```bash
export DATABASE_URL="postgresql://admin:admin1234@localhost:5432/vpn_db"
export REDIS_URL="redis://localhost:6379"
export NODE_ENV="production"
export JWT_SECRET="your-jwt-secret-key-here-change-in-production"
```

## Building the Project

```bash
cd /home/cheng/Project/vpn-service/backend
npm run build
```

## Starting the Service

### Development Mode

```bash
npm run dev:ts-node
```

### Production Mode

Using the startup script:

```bash
nohup ./start-server.sh > logs/server.log 2>&1 &
```

Or manually:

```bash
export DATABASE_URL="postgresql://admin:1234@localhost:5432/vpn_db"
export NODE_ENV="production"
nohup node dist/main.js > logs/server.log 2>&1 &
```

## Service Status

Check if the service is running:

```bash
ps aux | grep node | grep dist/main.js
```

View server logs:

```bash
tail -f logs/server.log
```

## API Endpoints

Once the service is running, available endpoints include:

- `GET /` - Root endpoint
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /nodes` - Get nodes (requires authentication)
- `GET /subscription/plans` - Get subscription plans
- `POST /subscription/purchase` - Purchase subscription
- `POST /vpn/connect` - Connect to VPN
- `POST /vpn/disconnect` - Disconnect from VPN
- `POST /payment/create` - Create payment

## Database Initialization

To initialize seed data, set `NODE_ENV=development` and run:

```bash
export DATABASE_URL="postgresql://admin:admin1234@localhost:5432/vpn_db"
export NODE_ENV="development"
npx ts-node src/seed.ts
```

## Troubleshooting

### Service Terminates Immediately

- Ensure database connection string is correct
- Check logs for error messages
- Verify PostgreSQL is running: `ps aux | grep postgres`

### Port Already in Use

If port 3000 is already in use, change the port in `src/main.ts`:

```typescript
await app.listen(3001);
```

And update environment variables accordingly.

### Permission Issues

If you encounter permission issues with systemd services, run as your user or adjust permissions.

## Production Deployment

For production deployment, consider using:

- Systemd for service management
- PM2 for process management
- Nginx as reverse proxy
- SSL/TLS termination
- Environment-specific configuration