@echo off
chcp 65001 >nul
color 0C

echo.
echo 🛑 Dừng Appointment System Backend...
echo ==========================================
echo.

REM Tìm và dừng các process Node.js chạy trên port 5000
echo 🔍 Tìm kiếm process đang chạy trên port 5000...

for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do (
    echo 📋 Process ID: %%a
    echo 🔪 Đang dừng process...
    taskkill /PID %%a /F
    if !errorlevel! equ 0 (
        echo ✅ Đã dừng process %%a thành công!
    ) else (
        echo ❌ Không thể dừng process %%a
    )
)

REM Dừng tất cả process node.js có tên chứa "server"
echo.
echo 🔍 Tìm kiếm các Node.js process khác...
tasklist /FI "IMAGENAME eq node.exe" /FO CSV | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo 🔪 Dừng tất cả Node.js processes...
    taskkill /IM node.exe /F
    echo ✅ Đã dừng tất cả Node.js processes!
) else (
    echo ℹ️  Không tìm thấy Node.js process nào đang chạy
)

echo.
echo ✅ Hoàn tất việc dừng server!
echo ==========================================
echo.
pause