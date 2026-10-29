import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // State form Thêm/Sửa
  const [formData, setFormData] = useState({ foodId: '', name: '', price: '', category: '' });
  const [editingId, setEditingId] = useState(null); // ID món đang sửa
  const [detailFood, setDetailFood] = useState(null); // Món đang xem chi tiết

  const fetchFoods = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/foods?search=${searchKeyword}`);
      setFoods(res.data);
    } catch (error) {
      showMessage('Lỗi kết nối tới server backend', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm mới hoặc Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Cập nhật món ăn (PUT)
        await axios.put(`${API_URL}/foods/${editingId}`, formData);
        showMessage('Cập nhật thông tin món ăn thành công!');
        setEditingId(null);
      } else {
        // Thêm món ăn mới (POST)
        await axios.post(`${API_URL}/foods`, formData);
        showMessage('Thêm món ăn thành công!');
      }
      fetchFoods();
      setFormData({ foodId: '', name: '', price: '', category: '' });
    } catch (error) {
      showMessage('Thao tác thất bại. Vui lòng kiểm tra lại!', 'error');
    }
  };

  // Chọn món để Sửa
  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      foodId: food.foodId,
      name: food.name,
      price: food.price,
      category: food.category || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ foodId: '', name: '', price: '', category: '' });
  };

  // Xóa món ăn
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món này không?')) return;
    try {
      await axios.delete(`${API_URL}/foods/${id}`);
      showMessage('Đã xóa món ăn thành công!');
      fetchFoods();
    } catch (error) {
      showMessage('Lỗi khi xóa món ăn', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Quản Lý Thực Đơn</h1>
          <p style={styles.subtitle}>Hệ thống quản lý món ăn cao cấp • MSSV: 236267</p>
        </div>

        {/* Alert Thông báo */}
        {message.text && (
          <div style={{
            ...styles.alert,
            backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: message.type === 'error' ? '#991b1b' : '#166534',
            borderColor: message.type === 'error' ? '#fca5a5' : '#86efac',
          }}>
            {message.text}
          </div>
        )}

        {/* Tìm kiếm */}
        <form onSubmit={handleSearch} style={styles.searchSection}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tên món, loại món..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.btnPrimary}>Tìm kiếm</button>
          <button type="button" onClick={() => { setSearch(''); fetchFoods(''); }} style={styles.btnSecondary}>Làm mới</button>
        </form>

        {/* Form Thêm / Cập nhật */}
        <div style={{ ...styles.formCard, borderColor: editingId ? '#3b82f6' : '#e2e8f0' }}>
          <h3 style={styles.formTitle}>
            {editingId ? '✏️ Cập nhật thông tin món ăn' : '✨ Thêm món ăn mới'}
          </h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input
              type="text"
              name="foodId"
              placeholder="Mã món (VD: F05)"
              value={formData.foodId}
              onChange={handleChange}
              disabled={!!editingId} // Mã món không cho sửa khi đang update
              required
              style={styles.input}
            />
            <input type="text" name="name" placeholder="Tên món ăn" value={formData.name} onChange={handleChange} required style={styles.input} />
            <input type="number" name="price" placeholder="Giá tiền (VNĐ)" value={formData.price} onChange={handleChange} required style={styles.input} />
            <input type="text" name="category" placeholder="Loại món (Món nước...)" value={formData.category} onChange={handleChange} style={styles.input} />
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={editingId ? styles.btnWarning : styles.btnSuccess}>
                {editingId ? '💾 Cập nhật món' : '+ Thêm món'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} style={styles.btnSecondary}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bảng Dữ Liệu */}
        {loading ? (
          <div style={styles.loading}>⏳ Đang tải dữ liệu thực đơn...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>MÃ MÓN</th>
                  <th style={styles.th}>TÊN MÓN ÁN</th>
                  <th style={styles.th}>LOẠI</th>
                  <th style={styles.th}>GIÁ BÁN</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.empty}>Không tìm thấy món ăn nào</td>
                  </tr>
                ) : (
                  foods.map((food) => (
                    <tr key={food._id} style={styles.tr}>
                      <td style={styles.tdCode}>{food.foodId}</td>
                      <td style={styles.tdName}>{food.name}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{food.category || 'Khác'}</span>
                      </td>
                      <td style={styles.tdPrice}>
                        {Number(food.price).toLocaleString('vi-VN')} <span style={{ fontSize: '12px', color: '#6b7280' }}>VNĐ</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => setDetailFood(food)} style={styles.btnInfo}>
                            👁️ Xem
                          </button>
                          <button onClick={() => handleEdit(food)} style={styles.btnEdit}>
                            ✏️ Sửa
                          </button>
                          <button onClick={() => handleDelete(food._id)} style={styles.btnDanger}>
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Xem Chi Tiết */}
        {detailFood && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>🔍 Chi Tiết Món Ăn</h3>
              <p><strong>Mã món:</strong> <span style={{ color: '#2563eb' }}>{detailFood.foodId}</span></p>
              <p><strong>Tên món:</strong> {detailFood.name}</p>
              <p><strong>Loại món:</strong> {detailFood.category || 'Khác'}</p>
              <p><strong>Giá bán:</strong> {Number(detailFood.price).toLocaleString('vi-VN')} VNĐ</p>
              <button onClick={() => setDetailFood(null)} style={{ ...styles.btnPrimary, width: '100%', marginTop: '15px' }}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif" },
  card: { maxWidth: '1000px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)', padding: '32px' },
  header: { borderBottom: '2px solid #f3f4f6', paddingBottom: '20px', marginBottom: '24px' },
  title: { margin: 0, fontSize: '28px', color: '#111827', fontWeight: '700' },
  subtitle: { margin: '6px 0 0 0', color: '#6b7280', fontSize: '14px' },
  alert: { padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid', fontWeight: '500' },
  searchSection: { display: 'flex', gap: '10px', marginBottom: '24px' },
  searchInput: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none' },
  btnPrimary: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { backgroundColor: '#e5e7eb', color: '#374151', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  formCard: { backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '28px', border: '2px solid #e2e8f0', transition: 'all 0.3s' },
  formTitle: { margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' },
  input: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  btnSuccess: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', flex: 1 },
  btnWarning: { backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', flex: 1 },
  tableWrapper: { overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { backgroundColor: '#f9fafb', padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#4b5563', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#374151' },
  tdCode: { padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#2563eb', fontFamily: 'monospace' },
  tdName: { padding: '14px 16px', fontSize: '15px', fontWeight: '600', color: '#111827' },
  tdPrice: { padding: '14px 16px', fontSize: '15px', fontWeight: '700', color: '#059669' },
  badge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  btnInfo: { backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  btnEdit: { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  btnDanger: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '30px', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '30px', color: '#9ca3af' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
};

export default App;