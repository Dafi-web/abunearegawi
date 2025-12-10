#!/bin/bash
# Quick script to restart the server with Cloudinary configuration check

echo "🔄 Restarting server..."
echo ""

# Check if server is running
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Server is running on port 5001"
    echo "   Please stop it first (Ctrl+C) or kill the process"
    echo ""
    echo "   To find and kill the process:"
    echo "   lsof -ti:5001 | xargs kill"
    exit 1
fi

# Check Cloudinary configuration
echo "📋 Checking Cloudinary configuration..."
node -e "
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const hasAll = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
if (hasAll) {
    console.log('✅ Cloudinary credentials found');
    console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
    console.log('❌ Cloudinary credentials missing!');
    console.log('   Please check your .env file');
    process.exit(1);
}
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Starting server..."
    npm start
else
    echo ""
    echo "❌ Cannot start server - Cloudinary not configured"
    exit 1
fi

