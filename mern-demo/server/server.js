const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas'))
  .catch((err) => console.log('Lỗi kết nối MongoDB:', err));

// Tạo Model Student
const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});
const Student = mongoose.model('Student', studentSchema);

// API GET /api/hello (Câu 22)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động' });
});

// API GET /api/students (Lấy danh sách sinh viên)
app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// API POST /api/students (Thêm sinh viên)
app.post('/api/students', async (req, res) => {
  const newStudent = await Student.create(req.body);
  res.json(newStudent);
});

// API PUT /api/students/:id (Cập nhật sinh viên)
app.put('/api/students/:id', async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStudent);
});

// API DELETE /api/students/:id (Xóa sinh viên)
app.delete('/api/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đã xóa sinh viên' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Node.js đang chạy trên port ${PORT}`);
});