# Website đăng ký khóa học Donut nhiều vị AN

Website này chạy trên Vercel, cho khách nhập Gmail và upload bill chuyển khoản. Bill được lưu lên Cloudinary, thông tin đăng ký được ghi vào Google Sheet.

## 1. Sửa thông tin khóa học

Mở file:

```txt
app/page.jsx
```

Tìm đoạn:

```js
const course = {
  name: 'Donut nhiều vị AN',
  price: '99.000đ',
  bank: 'MB Bank',
  accountNumber: '123456789',
  accountName: 'Nguyễn Văn A',
  transferNote: 'DONUT + Gmail'
};
```

Sửa lại thông tin nếu cần.

Ảnh poster nằm ở:

```txt
public/poster-donut.png
```

Muốn đổi poster thì thay file này bằng ảnh mới và giữ đúng tên `poster-donut.png`.

## 2. Tạo Google Sheet

Tạo Google Sheet mới, hàng đầu tiên nên đặt cột:

```txt
Thời gian | Khóa học | Giá | Gmail | Link bill | Trạng thái
```

Lấy `GOOGLE_SHEET_ID` trong link Google Sheet.

Ví dụ link:

```txt
https://docs.google.com/spreadsheets/d/ABC123456/edit
```

Thì Sheet ID là:

```txt
ABC123456
```

## 3. Tạo Google Service Account

Vào Google Cloud, tạo Service Account, bật Google Sheets API, tạo key dạng JSON.

Lấy 2 thông tin:

```txt
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
```

Sau đó share Google Sheet cho email service account với quyền Editor.

## 4. Tạo Cloudinary

Tạo tài khoản Cloudinary, lấy:

```txt
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

## 5. Thêm biến môi trường trên Vercel

Vào Vercel > Project > Settings > Environment Variables, thêm:

```txt
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Lưu ý `GOOGLE_PRIVATE_KEY` phải giữ nguyên dạng có `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`.

## 6. Chạy thử trên máy

Cài Node.js, mở thư mục này bằng VS Code rồi chạy:

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:3000
```

## 7. Đưa lên Vercel

Cách dễ nhất:

1. Upload source lên GitHub.
2. Vào Vercel.
3. Import GitHub project.
4. Thêm Environment Variables.
5. Bấm Deploy.

Sau khi chạy xong, khách đăng ký sẽ tự ghi vào Google Sheet.
