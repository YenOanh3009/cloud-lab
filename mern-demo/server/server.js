
const nodeCrypto = require('node:crypto');

// Khắc phục lỗi crypto is not defined
globalThis.crypto = nodeCrypto.webcrypto;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình PORT
const PORT = process.env.PORT || 5000;

// Schema Student
const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});

const Student = mongoose.model('Student', studentSchema);

// API kiểm tra Backend
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Backend đang hoạt động'
  });
});

// API GET - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Lỗi lấy sinh viên:', error);
    res.status(500).json({
      message: 'Lỗi lấy danh sách sinh viên'
    });
  }
});

// API POST - Thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Lỗi thêm sinh viên:', error);
    res.status(500).json({
      message: 'Lỗi thêm sinh viên'
    });
  }
});

// API PUT - Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error('Lỗi cập nhật sinh viên:', error);
    res.status(500).json({
      message: 'Lỗi cập nhật sinh viên'
    });
  }
});

// API DELETE - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.json({
      message: 'Đã xóa sinh viên thành công'
    });
  } catch (error) {
    console.error('Lỗi xóa sinh viên:', error);
    res.status(500).json({
      message: 'Lỗi xóa sinh viên'
    });
  }
});

// Kết nối MongoDB Atlas và khởi động server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Thiếu biến môi trường MONGODB_URI');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('Đã kết nối MongoDB Atlas');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server Node.js đang chạy trên port ${PORT}`);
    });

  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
}

startServer();
