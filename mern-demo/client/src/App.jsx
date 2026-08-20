import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });

  // Lấy danh sách sinh viên từ Backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://curly-computing-machine-pj954g46q6jrf7wj5-5000.app.github.dev/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://curly-computing-machine-pj954g46q6jrf7wj5-5000.app.github.dev/api/students', formData);
      fetchStudents(); 
      setFormData({ studentId: '', name: '', email: '' }); 
      alert('Thêm sinh viên thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
      alert('Lỗi khi thêm sinh viên!');
    }
  };

  return (
    <div className="App">
      <h1>Quản Lý Sinh Viên</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" name="studentId" placeholder="Mã số SV" value={formData.studentId} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <button type="submit">Thêm</button>
      </form>

      <h2>Danh sách:</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {students.map((student) => (
          <li key={student._id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
            <strong>{student.studentId}</strong> - {student.name} - {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;