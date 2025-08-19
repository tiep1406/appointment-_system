# 📜 Backend Scripts - Hướng dẫn sử dụng

## 🎯 Tổng quan
Các script được tạo để giúp quản lý backend của hệ thống đặt lịch hẹn một cách dễ dàng.

## 📋 Danh sách Scripts

### 1. 🚀 `start.bat` / `start.sh`
**Mục đích**: Khởi động backend server

**Chức năng**:
- Kiểm tra Node.js và npm
- Tự động cài đặt dependencies (nếu chưa có)
- Tạo file `.env` mặc định (nếu chưa có)
- Khởi động server trên port 5000

**Cách sử dụng**:
```bash
# Windows
double-click start.bat
# hoặc
start.bat

# Linux/Mac
./start.sh
```

### 2. 🛑 `stop.bat`
**Mục đích**: Dừng backend server

**Chức năng**:
- Tìm và dừng process chạy trên port 5000
- Dừng tất cả Node.js processes
- Báo cáo kết quả

**Cách sử dụng**:
```bash
# Windows
double-click stop.bat
# hoặc
stop.bat
```

### 3. 📦 `install.bat`
**Mục đích**: Cài đặt và cập nhật dependencies

**Chức năng**:
- Xóa node_modules và package-lock.json cũ
- Làm sạch npm cache
- Cài đặt dependencies mới
- Thử nhiều phương pháp cài đặt nếu gặp lỗi
- Hiển thị danh sách packages đã cài

**Cách sử dụng**:
```bash
# Windows
double-click install.bat
# hoặc
install.bat
```

## 🔄 Quy trình làm việc khuyến nghị

### Lần đầu setup:
1. Chạy `install.bat` để cài đặt dependencies
2. Chạy `start.bat` để khởi động server
3. Mở trình duyệt tại `http://localhost:5000`

### Làm việc hàng ngày:
1. Chạy `start.bat` để khởi động server
2. Làm việc với code
3. Chạy `stop.bat` khi muốn dừng server

### Khi có vấn đề với dependencies:
1. Chạy `stop.bat` để dừng server
2. Chạy `install.bat` để cài đặt lại dependencies
3. Chạy `start.bat` để khởi động lại server

## ⚙️ Cấu hình mặc định

Khi chạy lần đầu, file `.env` sẽ được tạo với cấu hình:
```env
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
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi "Node.js chưa được cài đặt"
- Tải và cài đặt Node.js từ: https://nodejs.org/
- Khởi động lại Command Prompt/Terminal

### Lỗi "Port 5000 đã được sử dụng"
- Chạy `stop.bat` để dừng process cũ
- Hoặc thay đổi PORT trong file `.env`

### Lỗi cài đặt dependencies
- Script sẽ tự động thử các phương pháp khác nhau
- Nếu vẫn lỗi, kiểm tra kết nối internet
- Thử chạy `npm cache clean --force` thủ công

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra log trong terminal
2. Đảm bảo Node.js và npm đã được cài đặt
3. Kiểm tra kết nối internet
4. Xem file `package.json` có đúng format không

---
*Các script được tối ưu cho Windows. Đối với Linux/Mac, sử dụng file `.sh`*