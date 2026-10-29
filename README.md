# Dự án Quản Lý Thực Đơn - MSSV: 236267_LeNguyenHuynhNhi

- Đã cấu hình MongoDB Atlas
- Đã đóng gói thành công ứng dụng bằng Docker và Docker Compose.

## Đường dẫn triển khai Render (Câu 7 & Câu 8)
- **Frontend Public URL (Câu 7):** `https://two36267-frontend.onrender.com`
- **Backend Public API (Câu 8):** `https://two36267-backend.onrender.com`
- **Backend Health Check:** `https://two36267-backend.onrender.com/health`

## Thông tin Docker Hub Images
- **Backend Image:** `s236267/236267_lenguyenhuynhnhi_backend:v1`
- **Frontend Image:** `s236267/236267_lenguyenhuynhnhi_frontend:v1`

## Hướng dẫn chạy bằng Docker
1. Kéo Image từ Docker Hub về máy:
   ```bash
   docker pull s236267/236267_lenguyenhuynhnhi_backend:v1
   docker pull s236267/236267_lenguyenhuynhnhi_frontend:v1