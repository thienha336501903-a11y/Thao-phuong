import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { google } from 'googleapis';

export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'donut-nhieu-vi-an-bills', resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function appendToSheet({ gmail, billUrl, courseName, price }) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        courseName,
        price,
        gmail,
        billUrl,
        'Chờ kiểm tra bill'
      ]]
    }
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const gmail = formData.get('gmail');
    const bill = formData.get('bill');
    const courseName = formData.get('courseName') || 'Donut nhiều vị AN';
    const price = formData.get('price') || '99.000đ';

    if (!gmail || !String(gmail).includes('@')) {
      return NextResponse.json({ error: 'Gmail không hợp lệ' }, { status: 400 });
    }
    if (!bill || typeof bill === 'string') {
      return NextResponse.json({ error: 'Chưa có bill chuyển khoản' }, { status: 400 });
    }

    const uploaded = await uploadToCloudinary(bill);
    await appendToSheet({ gmail, billUrl: uploaded.secure_url, courseName, price });

    return NextResponse.json({ ok: true, billUrl: uploaded.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Không gửi được đăng ký. Kiểm tra biến môi trường Vercel.' }, { status: 500 });
  }
}
