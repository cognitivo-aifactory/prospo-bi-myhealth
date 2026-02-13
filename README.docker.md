# Docker Setup

This project includes Docker Compose configurations for both development and production environments.

## Prerequisites

- Docker
- Docker Compose
- `.env` file with your Databricks configuration (copy from `.env.example`)

## Quick Start

### Production Build
```bash
# Build and start both frontend and backend
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Development Mode
```bash
# Build and start with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build
```

## Services

### Frontend (React + Vite)
- **Production**: Port 5173 (nginx)
- **Development**: Port 5173 (vite dev server)
- **URL**: http://localhost:5173

### Backend (Express.js)
- **Port**: 3001
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Environment Variables

Make sure to create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your Databricks credentials
```

Required variables:
- `VITE_DATABRICKS_HOST`
- `VITE_DATABRICKS_TOKEN`
- `VITE_GENIE_SPACE_ID`

## Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend

# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Scale services (if needed)
docker-compose up --scale backend=2
```

## Development vs Production

### Development Mode
- Hot reload enabled
- Source code mounted as volumes
- All dependencies installed
- Faster iteration

### Production Mode
- Optimized builds
- Nginx for frontend serving
- Minimal dependencies
- Better performance

## Troubleshooting

1. **Port conflicts**: Make sure ports 3001 and 5173 are available
2. **Environment variables**: Ensure `.env` file exists and contains valid values
3. **Build issues**: Try `docker-compose build --no-cache`
4. **Permission issues**: Ensure Docker has proper permissions

## Health Checks

Both services include health checks:
- Frontend: `curl http://localhost:5173`
- Backend: `curl http://localhost:3001/health`