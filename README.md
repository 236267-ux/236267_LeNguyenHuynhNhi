# BÀI THỰC HÀNH TỔNG HỢP FULL-STACK (MERN STACK)
- **Họ và tên / MSSV:** Lê Nguyễn Huỳnh Nhi - 236267
- **Tên Repository:** `236267_LeNguyenHuynhNhi`

---

## 📌 BẢNG THÔNG TIN NỘP BÀI (CÂU 9)

| Hạng mục | Đường dẫn / Thông tin |
| :--- | :--- |
| **GitHub Repository** | `https://github.com/236267-ux/236267_LeNguyenHuynhNhi` |
| **Frontend Public URL (Render)** | `https://two36267-frontend.onrender.com` |
| **Backend Public API (Render)** | `https://two36267-backend.onrender.com` |
| **Health Check Endpoint** | `https://two36267-backend.onrender.com/health` |
| **Backend Docker Image** | `s236267/236267_lenguyenhuynhnhi_backend:v1` |
| **Frontend Docker Image** | `s236267/236267_lenguyenhuynhnhi_frontend:v1` |
| **Database** | MongoDB Atlas (`Cluster0`) |

---

## 🛠 HƯỚNG DẪN KHỞI CHẠY ỨNG DỤNG BẰNG DOCKER

### Cách 1: Chạy riêng lẻ từng Container
1. **Chạy Backend Container:**
   ```bash
   docker run -d -p 5000:5000 -e PORT=5000 -e MONGO_URI="mongodb+srv://HuynhNhiMG:hnhimg@cluster0.horwc1l.mongodb.net/236267_LeNguyenHuynhNhi?retryWrites=true&w=majority" --name backend-app s236267/236267_lenguyenhuynhnhi_backend:v1