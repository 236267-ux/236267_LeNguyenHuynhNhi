const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');
const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Endpoint kiểm tra trạng thái backend
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend đang hoạt động', timestamp: new Date() });
});



// 1. Lấy danh sách & Tìm kiếm (GET /api/foods)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query = { $or: [{ name: regex }, { category: regex }, { cuisine: regex }] };
    }
    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// 2. Thêm món ăn mới (POST /api/foods)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, price } = req.body;
    if (!foodId || !name || !price) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ các trường bắt buộc' });
    }
    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Mã món ăn đã tồn tại' });
    }
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm món ăn', error });
  }
});

// 3. Xem thông tin một món ăn (GET /api/foods/:id)
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// 4. Cập nhật món ăn (PUT /api/foods/:id)
app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật', error });
  }
});

// 5. Xóa món ăn (DELETE /api/foods/:id)
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));