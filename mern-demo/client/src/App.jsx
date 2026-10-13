
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Backend mới trên Render
const API_URL = 'https://mern-backend-new-dhkg.onrender.com';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/students`
      );

      setStudents(response.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách sinh viên:', error);
      alert('Không thể tải danh sách sinh viên!');
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách khi mở trang
  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xóa dữ liệu trong form
  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      email: ''
    });

    setEditingId(null);
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      if (editingId) {
        // Cập nhật sinh viên
        await axios.put(
          `${API_URL}/api/students/${editingId}`,
          formData
        );

        alert('Cập nhật sinh viên thành công!');
      } else {
        // Thêm sinh viên
        await axios.post(
          `${API_URL}/api/students`,
          formData
        );

        alert('Thêm sinh viên thành công!');
      }

      resetForm();
      await fetchStudents();

    } catch (error) {
      console.error('Lỗi lưu sinh viên:', error);
      alert('Không thể lưu sinh viên!');
    } finally {
      setSaving(false);
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa sinh viên này?'
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/students/${id}`
      );

      alert('Xóa sinh viên thành công!');

      if (editingId === id) {
        resetForm();
      }

      await fetchStudents();

    } catch (error) {
      console.error('Lỗi xóa sinh viên:', error);
      alert('Không thể xóa sinh viên!');
    }
  };

  return (
    <div className="App">
      <h1>Quản Lý Sinh Viên</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: '20px' }}
      >
        <input
          type="text"
          name="studentId"
          placeholder="Mã số sinh viên"
          value={formData.studentId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving
            ? 'Đang lưu...'
            : editingId
              ? 'Cập nhật'
              : 'Thêm'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: '10px' }}
          >
            Hủy
          </button>
        )}
      </form>

      <h2>Danh sách sinh viên:</h2>

      {loading ? (
        <p>Đang tải danh sách sinh viên...</p>
      ) : students.length === 0 ? (
        <p>Chưa có sinh viên nào.</p>
      ) : (
        <ul
          style={{
            listStyleType: 'none',
            padding: 0
          }}
        >
          {students.map((student) => (
            <li
              key={student._id}
              style={{
                borderBottom: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px'
              }}
            >
              <strong>{student.studentId}</strong>
              {' - '}
              {student.name}
              {' - '}
              {student.email}

              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleEdit(student)}
                >
                  Sửa
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(student._id)}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: '#dc3545',
                    color: 'white'
                  }}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
