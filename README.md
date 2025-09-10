# Penitipan Hewan Peliharaan

Aplikasi sederhana untuk manajemen penitipan hewan peliharaan.
Frontend menggunakan **React.js**, backend menggunakan **Laravel**.

---

## Fitur

* Menambahkan data hewan dan pemilik
* Melihat daftar hewan yang sedang dititipkan
* Filter berdasarkan nama, email, dan jenis hewan
* Konfirmasi pengambilan hewan
* Menghitung biaya penitipan berdasarkan durasi jam

---

## Teknologi

* Frontend: React.js, Axios, TailwindCSS, Lucide Icons
* Backend: Laravel, MySQL
* Komunikasi antara frontend dan backend via REST API (JSON)

---

## Struktur Project

```
penitipan-hewan/
├─ backend/       # Laravel API
├─ frontend/      # React App
├─ README.md
```

---

## Persiapan Backend (Laravel)

1. Masuk ke folder backend:

```bash
cd backend
```

2. Install dependencies:

```bash
composer install
```

3. Buat file `.env` (copy dari `.env.example`) dan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=penitipan
DB_USERNAME=root
DB_PASSWORD=
```

4. Jalankan migrasi dan seeder (opsional):

```bash
php artisan migrate
php artisan db:seed
```

5. Jalankan server Laravel:

```bash
php artisan serve
```

> Laravel default berjalan di `http://127.0.0.1:8000`

---

## Persiapan Frontend (React)

1. Masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Jalankan development server:

```bash
npm start
```

> React default berjalan di `http://localhost:3000`

4. Pastikan URL API di `axios` sesuai dengan server Laravel, contohnya:

```javascript
axios.get("http://127.0.0.1:8000/api/penitipan")
```

---

## Cara Menggunakan

1. Buka React app di browser (`http://localhost:3000`)
2. Tambahkan data hewan dan pemilik
3. Filter data berdasarkan nama, email, atau jenis hewan
4. Pilih hewan yang akan diambil, pilih tanggal pengambilan
5. Sistem akan otomatis menghitung durasi dan biaya
6. Konfirmasi pengambilan hewan dan pembayaran

---

## Catatan

* Biaya dihitung dengan rumus: `Rp 100.000 × durasi jam (dari waktu pengambilan - waktu penitipan)`
* Backend Laravel sudah menggunakan API resource untuk CRUD data penitipan
* Pastikan backend berjalan sebelum menjalankan frontend agar data bisa diambil
