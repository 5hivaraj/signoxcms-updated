# SignoX Deployment Guide

## 🚀 Server Deployment

### 1. Environment Setup
```bash
# Clone repository
git clone <your-repo-url>
cd signox

# Backend setup
cd signox_backend
npm install
cp .env.example .env
# Edit .env with production values

# Frontend setup  
cd ../signox_frontend
npm install
cp .env.example .env
# Edit .env with production API URL
```

### 2. Production Configuration

#### Backend (.env)
```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
PORT=5000
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 3. Build & Deploy
```bash
# Build frontend
cd signox_frontend
npm run build

# Start with PM2
cd ../signox_backend
pm2 start src/server.js --name signox-backend
cd ../signox_frontend  
pm2 start npm --name signox-frontend -- start
```

## 📱 Samsung SSSP Deployment

### Installation URL
```
https://yourdomain.com/downloads/
```

### Files Required
- `signox-player.wgt` - Tizen app package
- `widget.xml` - SSSP configuration with auto_launch=true

## 🔧 Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    location /api/ {
        proxy_pass http://localhost:5000/;
    }
    
    location /downloads/ {
        alias /path/to/signox_frontend/public/downloads/;
        add_header Content-Type application/zip;
        add_header Access-Control-Allow-Origin *;
    }
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```