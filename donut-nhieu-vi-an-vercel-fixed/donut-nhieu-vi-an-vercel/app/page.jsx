'use client';

import { useState } from 'react';
import './style.css';

const course = {
  name: 'Donut nhiều vị AN',
  price: '99.000đ',
  bank: 'MB Bank',
  accountNumber: '123456789',
  accountName: 'Nguyễn Văn A',
  transferNote: 'DONUT + Gmail'
};

export default function Page() {
  const [gmail, setGmail] = useState('');
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (!gmail || !gmail.includes('@')) {
      setMessage('Vui lòng nhập Gmail hợp lệ.');
      return;
    }
    if (!bill) {
      setMessage('Vui lòng upload bill chuyển khoản.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('gmail', gmail);
    formData.append('bill', bill);
    formData.append('courseName', course.name);
    formData.append('price', course.price);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra');
      setMessage('Đăng ký thành công. Bạn vui lòng chờ kiểm tra bill và cấp quyền vào Drive.');
      setGmail('');
      setBill(null);
      e.target.reset();
    } catch (err) {
      setMessage(err.message || 'Gửi thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Khóa học online</p>
          <h1>{course.name}</h1>
          <p className="subtitle">Học công thức donut nhiều vị, có nhân ngọt – nhân mặn, phù hợp làm bán online hoặc bổ sung menu kinh doanh.</p>
          <a href="#register" className="primaryBtn">Đăng ký học ngay</a>
        </div>
        <div className="posterCard">
          <img src="/poster-donut.png" alt="Poster khóa học Donut nhiều vị AN" />
        </div>
      </section>

      <section className="infoGrid">
        <div className="card priceCard">
          <span>Học phí</span>
          <strong>{course.price}</strong>
          <p>Thanh toán chuyển khoản, sau đó upload bill để xác nhận.</p>
        </div>
        <div className="card">
          <h2>Nội dung học</h2>
          <p>8 loại nhân kem ngọt và 2 loại nhân mặn: vani, chocolate, matcha, cà phê, trà sữa đường đen, bí đỏ phô mai, khoai lang tím, sữa chua phô mai, cá ngừ khoai tây, jambon phô mai.</p>
        </div>
      </section>

      <section className="payment">
        <h2>Bước 1: Chuyển khoản học phí</h2>
        <div className="bankBox">
          <div><span>Ngân hàng</span><b>{course.bank}</b></div>
          <div><span>Số tài khoản</span><b>{course.accountNumber}</b></div>
          <div><span>Chủ tài khoản</span><b>{course.accountName}</b></div>
          <div><span>Nội dung CK</span><b>{course.transferNote}</b></div>
        </div>
        <p className="note">Ví dụ nội dung chuyển khoản: <b>DONUT tenban@gmail.com</b></p>
      </section>

      <section id="register" className="register">
        <h2>Bước 2: Gửi Gmail và bill chuyển khoản</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Gmail nhận khóa học
            <input type="email" placeholder="vidu@gmail.com" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
          </label>

          <label>
            Upload bill chuyển khoản
            <input type="file" accept="image/*,.pdf" onChange={(e) => setBill(e.target.files?.[0])} required />
          </label>

          <button disabled={loading} type="submit">
            {loading ? 'Đang gửi...' : 'Xác nhận đăng ký'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
}
