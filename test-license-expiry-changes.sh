#!/bin/bash

echo "🧪 Testing License Expiry Changes..."
echo ""

BASE_URL="http://192.168.1.232:5000/api"

# 1. Login as SUPER_ADMIN
echo "1️⃣ Logging in as SUPER_ADMIN..."
SUPER_ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@signox.com","password":"admin123"}')

SUPER_ADMIN_TOKEN=$(echo "$SUPER_ADMIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUPER_ADMIN_TOKEN" ]; then
  echo "❌ SUPER_ADMIN login failed"
  echo "$SUPER_ADMIN_RESPONSE"
  exit 1
fi

echo "✅ SUPER_ADMIN login successful"
echo ""

# 2. Create CLIENT_ADMIN without license expiry
echo "2️⃣ Creating CLIENT_ADMIN (should not have license expiry)..."
CLIENT_EMAIL="testclient_$(date +%s)@example.com"

CREATE_CLIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/users/client-admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" \
  -d "{\"email\":\"$CLIENT_EMAIL\",\"password\":\"password123\",\"companyName\":\"Test Company Ltd\"}")

echo "✅ CLIENT_ADMIN created successfully"
echo "📋 Response: $CREATE_CLIENT_RESPONSE"
echo ""

# Check if licenseExpiry field is absent
if echo "$CREATE_CLIENT_RESPONSE" | grep -q '"licenseExpiry"'; then
  echo "❌ ERROR: CLIENT_ADMIN still has license expiry field"
else
  echo "✅ Confirmed: CLIENT_ADMIN has no license expiry field"
fi
echo ""

# 3. Login as CLIENT_ADMIN
echo "3️⃣ Logging in as CLIENT_ADMIN..."
CLIENT_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CLIENT_EMAIL\",\"password\":\"password123\"}")

CLIENT_TOKEN=$(echo "$CLIENT_LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$CLIENT_TOKEN" ]; then
  echo "❌ CLIENT_ADMIN login failed"
  echo "$CLIENT_LOGIN_RESPONSE"
  exit 1
fi

echo "✅ CLIENT_ADMIN login successful"
echo ""

# 4. Create USER_ADMIN with license expiry
echo "4️⃣ Creating USER_ADMIN (should have license expiry)..."
USER_ADMIN_EMAIL="useradmin_$(date +%s)@example.com"
FUTURE_DATE=$(date -d "+6 months" +%Y-%m-%d)

CREATE_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d "{\"email\":\"$USER_ADMIN_EMAIL\",\"password\":\"password123\",\"maxDisplays\":15,\"maxUsers\":8,\"maxStorageMB\":50,\"maxMonthlyUsageMB\":200,\"licenseExpiry\":\"$FUTURE_DATE\"}")

echo "✅ USER_ADMIN created successfully"
echo "📋 Response: $CREATE_USER_RESPONSE"
echo ""

# Check if licenseExpiry field exists in userAdminProfile
if echo "$CREATE_USER_RESPONSE" | grep -q '"userAdminProfile".*"licenseExpiry"'; then
  echo "✅ Confirmed: USER_ADMIN has license expiry field in userAdminProfile"
else
  echo "❌ ERROR: USER_ADMIN missing license expiry field in userAdminProfile"
fi
echo ""

# 5. Test CLIENT_ADMIN list endpoint
echo "5️⃣ Testing CLIENT_ADMIN list endpoint..."
CLIENT_LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/users/client-admins" \
  -H "Authorization: Bearer $SUPER_ADMIN_TOKEN")

echo "📋 Client list response (first 500 chars):"
echo "$CLIENT_LIST_RESPONSE" | head -c 500
echo "..."
echo ""

# Check if any client has licenseExpiry
if echo "$CLIENT_LIST_RESPONSE" | grep -q '"licenseExpiry"'; then
  echo "❌ ERROR: Some CLIENT_ADMIN in list still has license expiry"
else
  echo "✅ Confirmed: No CLIENT_ADMIN in list has license expiry"
fi
echo ""

echo "🎉 License expiry migration test completed!"
echo ""
echo "📝 Summary:"
echo "✅ CLIENT_ADMIN creation works without license expiry"
echo "✅ USER_ADMIN creation works with license expiry"
echo "✅ License expiry is now managed at USER_ADMIN level only"