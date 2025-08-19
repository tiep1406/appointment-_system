@echo off
chcp 65001 >nul
color 0A

echo.
echo 🚀 Khởi động Appointment System Backend...
echo ==========================================
echo.

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chưa được cài đặt!
    echo Vui lòng cài đặt Node.js từ: https://nodejs.org/
    pause
    exit /b 1
)

REM Kiểm tra npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm chưa được cài đặt!
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Chuyển đến thư mục backend
cd /d "%~dp0"
echo 📁 Thư mục hiện tại: %cd%
echo.

REM Kiểm tra file package.json
if not exist "package.json" (
    echo ❌ Không tìm thấy package.json!
    pause
    exit /b 1
)

REM Kiểm tra thư mục node_modules
if not exist "node_modules" (
    echo 📦 Cài đặt dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Lỗi khi cài đặt dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies đã được cài đặt thành công!
) else (
    echo ✅ Dependencies đã có sẵn
)

echo.

REM Kiểm tra file .env
if not exist ".env" (
    echo ⚠️  Không tìm thấy file .env!
    echo Tạo file .env mặc định...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database Configuration ^(if needed^)
        echo # DB_HOST=localhost
        echo # DB_PORT=3306
        echo # DB_NAME=appointment_system
        echo # DB_USER=root
        echo # DB_PASSWORD=
        echo.
        echo # JWT Secret ^(if using authentication^)
        echo # JWT_SECRET=your_jwt_secret_here
    ) > .env
    echo ✅ File .env đã được tạo với cấu hình mặc định
) else (
    echo ✅ File .env đã tồn tại
)

echo.
echo 🔥 Khởi động server...
echo Server sẽ chạy tại: http://localhost:5000
echo Nhấn Ctrl+C để dừng server
echo ==========================================
echo.

REM Khởi động server
npm start

REM Nếu npm start không hoạt động, thử node server.js
if %errorlevel% neq 0 (
    echo ⚠️  npm start không hoạt động, thử chạy trực tiếp...
    node server.js
)

echo.
echo Server đã dừng.
pause