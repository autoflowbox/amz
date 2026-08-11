# Amazon Order Management

Bảng quản lý order Amazon: chạy Local hoặc deploy Netlify, dữ liệu lưu ở Supabase.

## Chạy Local

```bash
npm install
npm run dev
```

Mở http://localhost:5173. Cần đăng nhập (Supabase Auth) — xem `supabase/README.md` để setup database + tạo tài khoản đăng nhập lần đầu.

## Cấu hình

Sao chép `.env.example` thành `.env` và điền URL + anon key từ Supabase project (đã điền sẵn nếu bạn dùng project mặc định trong `Amazon Prompt.txt`).

## Deploy Netlify

1. Push repo lên GitHub (hoặc dùng `netlify deploy` với Netlify CLI).
2. Trên Netlify: New site from Git → chọn repo này. Build command và publish dir đã cấu hình sẵn trong `netlify.toml` (`npm run build` → `dist`).
3. Thêm biến môi trường `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong Site settings → Environment variables (giá trị giống file `.env`).

## Database (Supabase)

Xem `supabase/README.md` và `supabase/schema.sql`.

## Build

```bash
npm run build
```
