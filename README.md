# AdaSehat: Capstone Project 1 Bimbingan Karir

## Deskripsi
Proyek AdaSehat adalah bagian dari Capstone Project 1 untuk sistem Bimbingan Karir. Proyek ini mencakup 8 use case dari total 15 use case yang dirancang. 

Pada tahap ini, fitur yang dapat diakses meliputi:
- Login sebagai admin, dokter, dan pasien.
- Mengelola data dokter, pasien, poli, dan obat.
- Pendaftaran pasien melalui sistem.

Proyek ini dirancang untuk mempermudah pengelolaan data layanan kesehatan dengan antarmuka yang ramah pengguna.

---

## Fitur Utama
- Login Multi-Role: Admin, dokter, dan pasien.
- Manajemen Data: Kelola data dokter, pasien, poli, dan obat.
- Pendaftaran Pasien: Proses pendaftaran pasien secara daring.
- Dashboard Statistik: Visualisasi data menggunakan Chart.js

## Teknologi yang Digunakan
### Backend
- Framework: Laravel
- Database: MySQL
- Bahasa Pemrograman: PHP

### Frontend
- Framework: React
- Styling: Tailwind CSS
- Tools: Vite, Axios, Chart.js

## Instalasi

### Prasyarat
- Backend:
  - PHP >= 8.1
  - Composer
  - MySQL

- Frontend:
  - Node.js >= 16
  - NPM 

---

#Langkah-langkah clone dari github:
*salin Url Repo: https://github.com/tiaramalsa/Capstone-Project-1-Bimbingan-Karir.git
* buka cmd
* arahkan ke folder tujuan : Capstone-Project-1-Bimbingan-Karir
* git clone https://github.com/tiaramalsa/Capstone-Project-1-Bimbingan-Karir.git
  
##jika cloning selesai
* masuk folder proyek -> cd repository-name
* pastikan semua file berhasil diunduh -> ls

#Instal dependensi
*Backend: composer install
*Frontend: npm install

#Menjalankan Project
*Backend -> migration -> php artisan migration
*Backend: php artisan serve
*Frontend: npm run dev

*catatan*
- Pastikan Anda telah mengatur file .env untuk konfigurasi database di Laravel.
- Gunakan php artisan migrate --seed jika ada data awal yang perlu diisi.
- Akses aplikasi pada:
      - Backend: http://127.0.0.1:8000
      - Frontend: URL yang diberikan oleh Vite.
