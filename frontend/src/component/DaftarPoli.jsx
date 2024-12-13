
import React from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";


const DaftarPoli = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Daftar Poli</h1>

        {/* Form Pendaftaran Poli */}
        <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Form Pendaftaran Poli</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                type="text"
                id="nama"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div>
              <label htmlFor="poli" className="block text-sm font-medium text-gray-700">
                Pilih Poli
              </label>
              <select
                id="poli"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Poli --</option>
                <option value="umum">Poli Umum</option>
                <option value="anak">Poli Anak</option>
                <option value="gigi">Poli Gigi</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Daftar
            </button>
          </form>
        </div>

        {/* Riwayat Pendaftaran Poli */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Riwayat Pendaftaran Poli</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>01/01/2024 - Poli Umum</li>
            <li>15/12/2023 - Poli Gigi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DaftarPoli;
