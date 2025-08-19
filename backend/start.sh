#!/bin/bash

# Appointment System Backend Startup Script
# Tác giả: Hệ thống đặt lịch hẹn
# Mô tả: Script khởi động backend server

echo "🚀 Khởi động Appointment System Backend..."
echo "==========================================="

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt!"
    echo "Vui lòng cài đặt Node.js từ: https://nodejs.org/"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt!"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Chuyển đến thư mục backend
cd "$(dirname "$0")"
echo "📁 Thư mục hiện tại: $(pwd)"
echo ""

# Kiểm tra file package.json
if [ ! -f "package.json" ]; then
    echo "❌ Không tìm thấy package.json!"
    exit 1
fi

# Kiểm tra thư mục node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Cài đặt dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi cài đặt dependencies!"
        exit 1
    fi
    echo "✅ Dependencies đã được cài đặt thành công!"
else
    echo "✅ Dependencies đã có sẵn"
fi

echo ""

# Kiểm tra file .env
if [ ! -f ".env" ]; then
    echo "⚠️  Không tìm thấy file .env!"
    echo "Tạo file .env mặc định..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (if needed)
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=appointment_system
# DB_USER=root
# DB_PASSWORD=

# JWT Secret (if using authentication)
# JWT_SECRET=your_jwt_secret_here
EOF
    echo "✅ File .env đã được tạo với cấu hình mặc định"
else
    echo "✅ File .env đã tồn tại"
fi

echo ""
echo "🔥 Khởi động server..."
echo "Server sẽ chạy tại: http://localhost:5000"
echo "Nhấn Ctrl+C để dừng server"
echo "==========================================="
echo ""

# Khởi động server
npm start

# Nếu npm start không hoạt động, thử node server.js
if [ $? -ne 0 ]; then
    echo "⚠️  npm start không hoạt động, thử chạy trực tiếp..."
    node server.js
fi