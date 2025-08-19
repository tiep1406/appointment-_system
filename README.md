# 📅 Appointment System - Hệ thống đặt lịch hẹn

Hệ thống đặt lịch hẹn hiện đại được xây dựng với React và Node.js, tối ưu cho việc deploy trên Replit.

## 🚀 Tính năng chính

- ✅ **Đặt lịch theo ngày**: Chọn ngày và xem lịch trình chi tiết
- ⏰ **Khung giờ linh hoạt**: Hoạt động từ 7:00 - 19:00 với slot 30 phút
- 🚫 **Chống trùng lặp**: Một thời điểm chỉ có một lịch hẹn
- ⏱️ **Hủy lịch thông minh**: Chỉ cho phép hủy trước 30 phút
- 📱 **Giao diện responsive**: Tương thích mọi thiết bị
- 🔄 **Real-time updates**: Cập nhật trạng thái ngay lập tức

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Material-UI (MUI)** - Component Library
- **Date-fns** - Date manipulation
- **Axios** - HTTP Client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **In-memory Database** - Simple data storage
- **CORS** - Cross-origin resource sharing

## 📦 Cấu trúc dự án

```
appointment_system/
├── 📁 backend/              # Backend API
│   ├── 📄 server.js         # Main server file
│   ├── 📁 routes/           # API routes
│   ├── 📄 package.json      # Backend dependencies
│   ├── 🚀 start.bat         # Windows startup script
│   ├── 🚀 start.sh          # Linux/Mac startup script
│   ├── 🛑 stop.bat          # Stop server script
│   ├── 📦 install.bat       # Install dependencies script
│   └── 📖 SCRIPTS_README.md # Scripts documentation
├── 📁 frontend/             # React frontend
│   ├── 📁 src/              # Source code
│   ├── 📁 public/           # Static files
│   └── 📄 package.json      # Frontend dependencies
├── 📄 .replit               # Replit configuration
├── 📄 replit.nix            # Nix environment
├── 📄 package.json          # Root package.json
└── 📖 README.md             # This file
```

## 🌐 Deploy trên Replit

### Bước 1: Tạo Repl mới
1. Truy cập [Replit.com](https://replit.com)
2. Đăng nhập hoặc tạo tài khoản
3. Click "Create Repl" → "Import from GitHub" hoặc "Upload folder"
4. Chọn template "Node.js"

### Bước 2: Upload code
1. Upload toàn bộ thư mục dự án
2. Đảm bảo có đầy đủ các file:
   - `.replit` (cấu hình Replit)
   - `replit.nix` (môi trường Nix)
   - `package.json` (root)
   - Thư mục `backend/` và `frontend/`

### Bước 3: Cấu hình Environment Variables
Trong Replit, vào **Secrets** tab và thêm:
```
PORT=5000
NODE_ENV=production
REACT_APP_API_URL=https://your-repl-name.your-username.repl.co
```

### Bước 4: Chạy dự án
1. Click nút **Run** hoặc gõ lệnh: `npm run dev`
2. Replit sẽ tự động:
   - Cài đặt dependencies cho cả backend và frontend
   - Khởi động backend server (port 5000)
   - Khởi động frontend development server (port 3000)
   - Mở preview window

### Bước 5: Chia sẻ
1. Click **Share** để lấy link public
2. Copy link và gửi cho người khác
3. Đảm bảo Repl được set "Public" để mọi người truy cập được

## 💻 Chạy local (Development)

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài đặt và chạy

#### Cách 1: Sử dụng scripts (Windows)
```bash
# Cài đặt dependencies
cd backend
install.bat

# Khởi động backend
start.bat

# Mở terminal mới, khởi động frontend
cd frontend
npm install
npm start
```

#### Cách 2: Manual
```bash
# Clone repository
git clone <repository-url>
cd appointment_system

# Cài đặt dependencies cho backend
cd backend
npm install
npm start

# Mở terminal mới, cài đặt và chạy frontend
cd frontend
npm install
npm start
```

#### Cách 3: Chạy đồng thời (Root level)
```bash
# Cài đặt concurrently
npm install

# Chạy cả backend và frontend
npm run dev
```

## 📋 API Endpoints

### Appointments
- `GET /api/appointments?date=YYYY-MM-DD` - Lấy lịch hẹn theo ngày
- `POST /api/appointments` - Tạo lịch hẹn mới
- `DELETE /api/appointments/:id` - Hủy lịch hẹn

### Request/Response Examples

#### Tạo lịch hẹn mới
```javascript
POST /api/appointments
{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerEmail": "nguyenvana@email.com",
  "date": "2024-01-15",
  "time": "09:00",
  "service": "Tư vấn",
  "notes": "Ghi chú thêm"
}
```

#### Response thành công
```javascript
{
  "success": true,
  "message": "Đặt lịch hẹn thành công!",
  "appointment": {
    "id": "1",
    "customerName": "Nguyễn Văn A",
    "date": "2024-01-15",
    "time": "09:00",
    "endTime": "09:30"
  }
}
```

## 🎯 Sử dụng hệ thống

### Đặt lịch hẹn
1. Chọn ngày từ date picker
2. Xem các slot thời gian có sẵn (màu xanh)
3. Click vào slot muốn đặt
4. Điền thông tin khách hàng
5. Click "Đặt lịch" để xác nhận

### Hủy lịch hẹn
1. Chọn ngày có lịch hẹn
2. Tìm slot đã đặt (màu đỏ)
3. Click nút "Hủy"
4. Xác nhận hủy (chỉ được hủy trước 30 phút)

### Quy tắc nghiệp vụ
- ⏰ Giờ hoạt động: 7:00 - 19:00
- 📅 Chỉ đặt lịch cho ngày hiện tại và tương lai
- ⏱️ Mỗi slot kéo dài 30 phút
- 🚫 Không được đặt trùng thời gian
- ⏰ Chỉ hủy được trước 30 phút

## 🐛 Troubleshooting

### Lỗi "Invalid Host header" trên Replit
✅ **Đã được xử lý** - File `.env` đã được cấu hình với:
```
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_HOST=0.0.0.0
```

### Lỗi CORS
✅ **Đã được xử lý** - Backend đã cấu hình CORS cho mọi origin

### Port conflicts
- Backend: Port 5000
- Frontend: Port 3000
- Replit sẽ tự động map ports

### Dependencies issues
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 📞 Hỗ trợ

- 📧 Email: support@appointmentsystem.com
- 📱 Phone: +84 123 456 789
- 🌐 Website: https://appointmentsystem.com
- 📖 Documentation: https://docs.appointmentsystem.com

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

**Phát triển bởi**: Appointment System Team  
**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2024-01-15