# Testing Tools

This directory contains testing utilities for the SignoX platform.

## 🧪 Available Tests

### `test-mime-types.js`
Tests MIME type configuration for Samsung SSSP compatibility.
```bash
node test-mime-types.js --production  # Test production server
node test-mime-types.js --local       # Test local development
```

### `test-samsung-sssp.js`  
Simulates Samsung display installation process.
```bash
node test-samsung-sssp.js
```

### `test-dev-server.js`
Local development server for testing changes.
```bash
node test-dev-server.js
```

### `nginx-mime-config.conf`
Nginx configuration snippet for proper MIME types.

## 🎯 Usage

Before deploying to production:
1. Run `test-samsung-sssp.js` to verify current setup
2. Use `test-dev-server.js` to test changes locally
3. Apply `nginx-mime-config.conf` if using Nginx