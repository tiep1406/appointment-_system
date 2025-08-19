@echo off
chcp 65001 >nul
color 0B

echo.
echo 📦 Cài đặt Dependencies cho Appointment System Backend
echo =====================================================
echo.

REM Kiểm tra Node.js và npm
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chưa được cài đặt!
    echo Vui lòng cài đặt Node.js từ: https://nodejs.org/
    pause
    exit /b 1
)

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

REM Xóa node_modules và package-lock.json cũ (nếu có)
if exist "node_modules" (
    echo 🗑️  Xóa thư mục node_modules cũ...
    rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
    echo 🗑️  Xóa package-lock.json cũ...
    del "package-lock.json"
)

echo.
echo 🧹 Làm sạch npm cache...
npm cache clean --force

echo.
echo 📦 Cài đặt dependencies mới...
npm install

if %errorlevel% neq 0 (
    echo ❌ Lỗi khi cài đặt dependencies!
    echo.
    echo 🔧 Thử cài đặt với --legacy-peer-deps...
    npm install --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo ❌ Vẫn lỗi! Thử cài đặt với --force...
        npm install --force
        
        if %errorlevel% neq 0 (
            echo ❌ Không thể cài đặt dependencies!
            pause
            exit /b 1
        )
    )
)

echo.
echo ✅ Dependencies đã được cài đặt thành công!
echo.
echo 📋 Danh sách packages đã cài đặt:
npm list --depth=0

echo.
echo 🎉 Hoàn tất cài đặt!
echo Bạn có thể chạy server bằng cách:
echo   - Chạy start.bat
echo   - Hoặc: npm start
echo   - Hoặc: node server.js
echo =====================================================
echo.
pause