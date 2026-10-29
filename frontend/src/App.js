import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Lấy URL backend từ file .env
const API_URL = 'http://localhost:5000/api';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ foodId: '', name: '', price: '', category: '' });

  // Lấy danh sách món ăn
  const fetchFoods = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/foods?search=${searchKeyword}`);
      setFoods(res.data);
      setMessage('');
    } catch (error) {
      setMessage('Lỗi khi tải dữ liệu từ server');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  // Xử lý nhập liệu form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm món ăn
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/foods`, formData);
      setMessage('Thêm món ăn thành công!');
      fetchFoods();
      setFormData({ foodId: '', name: '', price: '', category: '' });
    } catch (error) {
      setMessage('Lỗi: Thêm thất bại (có thể trùng mã món ăn)');
    }
  };

  // Xóa món ăn
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món này?')) return;
    try {
      await axios.delete(`${API_URL}/foods/${id}`);
      setMessage('Xóa thành công!');
      fetchFoods();
    } catch (error) {
      setMessage('Lỗi khi xóa món ăn');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Quản lý món ăn</h1>
      {message && <p style={{ color: 'blue', fontWeight: 'bold' }}>{message}</p>}

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Nhập tên món, loại..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '5px' }} />
        <button type="submit" style={{ marginLeft: '5px', padding: '5px 10px' }}>Tìm kiếm</button>
        <button type="button" onClick={() => {setSearch(''); fetchFoods('');}} style={{ marginLeft: '5px', padding: '5px 10px' }}>Làm mới</button>
      </form>

      {/* Form thêm món ăn */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Thêm món mới</h3>
        <input type="text" name="foodId" placeholder="Mã (VD: F04)" value={formData.foodId} onChange={handleChange} required style={{ marginRight: '5px' }} />
        <input type="text" name="name" placeholder="Tên món" value={formData.name} onChange={handleChange} required style={{ marginRight: '5px' }} />
        <input type="number" name="price" placeholder="Giá" value={formData.price} onChange={handleChange} required style={{ marginRight: '5px' }} />
        <input type="text" name="category" placeholder="Loại (Món nước...)" value={formData.category} onChange={handleChange} style={{ marginRight: '5px' }} />
        <button type="submit" style={{ padding: '5px 10px' }}>Thêm</button>
      </form>

      {/* Danh sách món ăn */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Mã món</th><th>Tên món</th><th>Loại</th><th>Giá</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id}>
                <td>{food.foodId}</td>
                <td>{food.name}</td>
                <td>{food.category}</td>
                <td>{food.price} VNĐ</td>
                <td>
                  <button onClick={() => handleDelete(food._id)} style={{ color: 'red' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;