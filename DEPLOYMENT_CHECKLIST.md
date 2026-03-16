# 🚀 SignoX Deployment Checklist

## Pre-Deployment

### ✅ Code Preparation
- [ ] All sensitive data moved to .env files
- [ ] .env.example files created and updated
- [ ] .gitignore updated to exclude sensitive files
- [ ] Code committed to GitHub
- [ ] Production branch created

### ✅ Environment Setup
- [ ] Server provisioned (Ubuntu 22.04+ recommended)
- [ ] Domain name configured
- [ ] SSL certificate obtained
- [ ] MongoDB database setup
- [ ] Node.js 18+ installed

## Deployment Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Application Deployment
```bash
# Clone repository
git clone <your-github-repo>
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
npm run build
```

### 3. Process Management
```bash
# Start backend
cd signox_backend
pm2 start src/server.js --name signox-backend

# Start frontend
cd ../signox_frontend
pm2 start npm --name signox-frontend -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/signox

# Enable site
sudo ln -s /etc/nginx/sites-available/signox /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Post-Deployment Testing

### ✅ Backend API
- [ ] Health check: `curl https://yourdomain.com/api/health`
- [ ] Authentication endpoints working
- [ ] File uploads working

### ✅ Frontend
- [ ] Website loads: `https://yourdomain.com`
- [ ] Login functionality works
- [ ] Dashboard accessible

### ✅ Samsung SSSP
- [ ] WGT file accessible: `https://yourdomain.com/downloads/signox-player.wgt`
- [ ] Widget.xml available: `https://yourdomain.com/downloads/widget.xml`
- [ ] MIME types correct (run `node testing-tools/test-samsung-sssp.js`)

### ✅ Android Player
- [ ] APK downloadable: `https://yourdomain.com/downloads/signox-player.apk`
- [ ] Player connects to server
- [ ] Pairing process works

## Security Checklist

### ✅ Server Security
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Regular security updates enabled
- [ ] Fail2ban installed

### ✅ Application Security  
- [ ] Strong JWT secret (32+ characters)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced

## Monitoring Setup

### ✅ Process Monitoring
- [ ] PM2 monitoring dashboard
- [ ] Log rotation configured
- [ ] Disk space monitoring

### ✅ Application Monitoring
- [ ] Error logging working
- [ ] Performance metrics tracked
- [ ] Backup strategy implemented

## Samsung QB55C Testing

### ✅ SSSP Installation
- [ ] Navigate to Settings → Custom App
- [ ] Enter URL: `https://yourdomain.com/downloads/`
- [ ] App downloads and installs
- [ ] App launches automatically
- [ ] Pairing process works
- [ ] Content displays correctly

## Rollback Plan

### ✅ Backup Strategy
- [ ] Database backup created
- [ ] Previous version tagged in Git
- [ ] Rollback procedure documented
- [ ] Recovery time objective defined

## Sign-off

- [ ] Technical lead approval
- [ ] Client testing completed  
- [ ] Documentation updated
- [ ] Support team notified

**Deployment Date**: ___________
**Deployed by**: ___________
**Approved by**: ___________