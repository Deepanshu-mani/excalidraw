# EC2 Deployment Guide

## Environment Configuration

Create a `.env` file in your project root with the following configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost/draw-app

# Security (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Ports
HTTP_PORT=4000
WS_PORT=8080

# Frontend URLs (Update these for your EC2 deployment)
NEXT_PUBLIC_HTTP_BACKEND=https://api.xtmani.excalidraw.com/api/v1
NEXT_PUBLIC_WS_URL=wss://ws.xtmani.excalidraw.com

# Avatar Services
NEXT_PUBLIC_AVATAR_PRIMARY_URL=https://avatar.iran.liara.run/public
NEXT_PUBLIC_AVATAR_FALLBACK_URL=https://ui-avatars.com/api

# App Settings
NODE_ENV=production
CORS_ORIGIN=https://xtmani.excalidraw.com
LOG_LEVEL=info
```

## Troubleshooting Sign-in Issues

### 1. Check API Endpoints
Make sure your frontend is correctly configured to call:
- `https://api.xtmani.excalidraw.com/api/v1/user/signin`
- `https://api.xtmani.excalidraw.com/api/v1/user/signup`

### 2. Environment Variables for All Services
Make sure these environment variables are set correctly on your EC2:

**For Frontend (Next.js):**
```env
NEXT_PUBLIC_HTTP_BACKEND=https://api.xtmani.excalidraw.com/api/v1
NEXT_PUBLIC_WS_URL=wss://ws.xtmani.excalidraw.com
```

**For HTTP Server:**
```env
CORS_ORIGIN=https://xtmani.excalidraw.com
HTTP_PORT=4000
```

**For WebSocket Server:**
```env
WS_PORT=8080
```

### 2. Check CORS Configuration
The HTTP server now includes proper CORS configuration for your domain.

### 3. Check Database Connection
Ensure PostgreSQL is running and the database is accessible.

### 4. Check WebSocket Connection
Make sure the WebSocket server is running on port 8080.

## Nginx Configuration

Make sure your Nginx configuration includes:

```nginx
# Frontend (Next.js)
server {
    listen 80;
    server_name xtmani.excalidraw.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API Server
server {
    listen 80;
    server_name api.xtmani.excalidraw.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# WebSocket Server
server {
    listen 80;
    server_name ws.xtmani.excalidraw.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## Testing the Deployment

1. **Test API directly:**
   ```bash
   curl -X POST https://api.xtmani.excalidraw.com/api/v1/user/signin \
     -H "Content-Type: application/json" \
     -d '{"username":"test@example.com","password":"testpassword"}'
   ```

2. **Check WebSocket:**
   ```bash
   wscat -c wss://ws.xtmani.excalidraw.com
   ```

3. **Check frontend:**
   Visit `https://xtmani.excalidraw.com` and check browser console for errors.
