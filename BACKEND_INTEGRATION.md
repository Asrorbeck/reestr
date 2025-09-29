# Backend API Integration - Login System

## O'zgarishlar

### 1. Authentication System

- **AuthProvider** (`hooks/use-auth.tsx`) - Foydalanuvchi autentifikatsiyasi va token boshqaruvi
- **AuthGuard** (`components/auth/auth-guard.tsx`) - Route himoyasi komponenti
- **API Utilities** (`lib/api.ts`) - Backend API bilan bog'lanish uchun utility funksiyalar

### 2. Login Form Integration

- Login form endi backend API (`http://localhost:3001/api/auth/login`) bilan bog'langan
- Token localStorage da saqlanadi
- Muvaffaqiyatli login dan keyin dashboard ga yo'naltiriladi

### 3. Route Protection

- Barcha sahifalar login qilmagan foydalanuvchilar uchun himoyalangan
- Faqat `/login` sahifasi ochiq
- Token mavjud bo'lmagan holda avtomatik login sahifasiga yo'naltiriladi

### 4. User Interface Updates

- Header komponentida foydalanuvchi ma'lumotlari ko'rsatiladi
- Logout funksiyasi qo'shildi
- Role-based access control (RoleGuard) yangilandi

## API Endpoints

### Authentication

- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/verify` - Token verification

### Data Endpoints

- `GET /integrations` - Barcha integratsiyalar
- `GET /users` - Barcha foydalanuvchilar
- `GET /audit/logs` - Audit loglari
- `GET /settings` - Sozlamalar

## Ishlatish

1. Backend serverni ishga tushiring: `http://localhost:3001`
2. Frontend ni ishga tushiring: `npm run dev`
3. Login sahifasiga o'ting: `http://localhost:3000/login`
4. Test ma'lumotlari:
   - Email: `admin@cbu.uz`
   - Password: `admin123`

## Xususiyatlar

- ✅ Backend API bilan integratsiya
- ✅ Token-based authentication
- ✅ Route protection
- ✅ User session management
- ✅ Role-based access control
- ✅ Automatic redirects
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
