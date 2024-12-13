import React from "react";
import { FaHeartbeat, FaUserMd, FaTooth, FaChild } from "react-icons/fa";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const Dashboard = () => {
  return (
    <>
    <div className=""></div>
    <div className="bg-blue-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white shadow-lg sticky">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold flex items-center">
            <img src="/src/assets/logo.png" alt="Doctorate Logo" className="h-8 w-8 mr-2" /> {/* Logo */}
            AdaSehat
          </a>
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-blue-200">Home</a>
            <a href="#about" className="hover:text-blue-200">About</a>
            <a href="#services" className="hover:text-blue-200">Poli</a>
            <a href="#doctors" className="hover:text-blue-200">Dokter</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="text-white py-20 relative bg-cover"
        style={{
            backgroundImage: "url('/src/assets/doctor1.png')",
            backgroundPosition: "center right",
            backgroundSize: "contain", 
            backgroundRepeat: "no-repeat",
        }}
        >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
            <div className="bg-opacity-70 p-8 rounded-lg">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-700">
                Sehat Lebih Mudah Bersama Kami
            </h1>
            <p className="text-lg md:text-2xl mb-6 text-gray-700">
            Temukan dokter, buat janji, dan kelola kesehatan keluarga Anda dalam satu platform.
            </p>
            <a
                href="#about"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-blue-100"
            >
                Selengkapnya
            </a>
            </div>
        </div>
      </section>

      {/* Login */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Login sebagai Pasien</h3>
            <p className="text-gray-600 mb-6">Akses layanan kesehatan sebagai pasien terdaftar.</p>
            <a
              href="/loginuser"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Masuk sebagai Pasien
            </a>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Login sebagai Dokter</h3>
            <p className="text-gray-600 mb-6">Akses panel dokter untuk melihat jadwal dan memeriksa pasien.</p>
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Masuk sebagai Dokter
            </a>
          </div>
        </div>
      </section>

      {/* About  */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative">
            
            <div className="rounded-lg shadow-md">
              <img
                src="/src/assets/rs1.jpg"
                alt="Hospital Interior"
                className="rounded-lg shadow-md w-full mb-4"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
            <p className="text-gray-600 mb-4">
            Selamat datang di AdaSehat mitra terpercaya untuk kesehatan Anda dan keluarga. Kami hadir untuk memberikan layanan medis yang profesional, mudah diakses, dan berkualitas tinggi. Dengan tim dokter berpengalaman dan teknologi modern, kami berkomitmen membantu Anda menjalani hidup yang lebih sehat dan bahagia. Temukan berbagai solusi kesehatan yang dirancang untuk memenuhi kebutuhan unik Anda, kapan saja dan di mana saja. 
            Bersama kami, kesehatan Anda adalah prioritas utama.</p>
            {/* <p className="text-gray-600">
              Our mission is to ensure the health and well-being of our community through compassionate care and cutting-edge medical technologies.
            </p> */}
          </div>
        </div>
      </section>

      {/* Poli */}
      <section id="services" className="py-16 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Poli</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaHeartbeat className="text-blue-700 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-700">Poli Jantung</h3>
              <p className="text-gray-700 mt-2">
              Layanan khusus untuk pemeriksaan, diagnosis, dan pengobatan penyakit jantung dan pembuluh darah.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaUserMd className="text-blue-700 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-700">Poli Umum</h3>
              <p className="text-gray-700 mt-2">
              Layanan kesehatan dasar untuk berbagai keluhan medis ringan hingga sedang.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaTooth className="text-blue-700 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-700">Poli Gigi</h3>
              <p className="text-gray-700 mt-2">
              Perawatan kesehatan gigi dan mulut, termasuk pembersihan, tambal, dan cabut gigi.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <FaChild className="text-blue-700 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-700">Poli Anak</h3>
              <p className="text-gray-700 mt-2">
              Layanan kesehatan anak, termasuk pemeriksaan, imunisasi, dan pemantauan tumbuh kembang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dockter */}
    <section id="doctors" className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">Dokter Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         
          <div className="bg-white shadow-md rounded-lg overflow-hidden items-center">
            <img 
              src="/src/assets/dr1.png" 
              alt="Doctor's Photo" 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-700">Dr. Jane</h3>
              <p className="text-gray-600">Spesialis Jantung</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden items-center">
            <img 
              src="/src/assets/dr2.png" 
              alt="Doctor's Photo" 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-700">Dr. Royan</h3>
              <p className="text-gray-600">Dokter Umum</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden items-center">
            <img 
              src="/src/assets/dr3.png" 
              alt="Doctor's Photo" 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-700">Dr. Angga</h3>
              <p className="text-gray-600">Spesialis Anak</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden items-center">
            <img 
              src="/src/assets/doctor.png" 
              alt="Doctor's Photo" 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-700">Dr. Raina</h3>
              <p className="text-gray-600">Spesialis Gigi</p>
            </div>
          </div>
        </div>
      </div>
    </section>


      {/* Footer */}
    <footer className="bg-blue-700 text-white py-6">
            <div className="container mx-auto text-center">
            <p>&copy; 2024 Doctorate. All Rights Reserved.</p>
            </div>
        </footer>
        </div>
        </>
    );
    };

export default Dashboard;