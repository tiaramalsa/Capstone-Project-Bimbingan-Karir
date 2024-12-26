import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const DetailRiwayatPasien = () => {
  const { idPeriksa } = useParams(); 
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailRiwayat = async () => {
      if (!idPeriksa) {
        setError("ID pemeriksaan tidak valid.");
        return;
      }

      try {
        const response = await axios.get(`/riwayatpasien/detail/${idPeriksa}`);
        console.log("Detail Riwayat API Response:", response.data);
        if (response.data) {
          setDetail(response.data);
        } else {
          setError("Data detail riwayat tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching detail riwayat:", err.response || err.message);
        setError("Gagal memuat detail riwayat. Periksa koneksi atau hubungi admin.");
      }
    };

    fetchDetailRiwayat();
  }, [idPeriksa]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Detail Riwayat Pasien</h2>
          <p className="text-gray-600">Informasi lengkap tentang riwayat pemeriksaan</p>
        </div>
        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : detail ? (
          <div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Informasi Pasien</h3>
              <p className="text-gray-600 mt-2"><strong>Nama Poli:</strong> {detail.nama_poli}</p>
              <p className="text-gray-600"><strong>Nama Dokter:</strong> {detail.nama_dokter}</p>
              <p className="text-gray-600"><strong>Hari:</strong> {detail.hari}</p>
              <p className="text-gray-600"><strong>Jam Mulai:</strong> {detail.jam_mulai}</p>
              <p className="text-gray-600"><strong>Jam Selesai:</strong> {detail.jam_selesai}</p>
              <p className="text-gray-600"><strong>Tanggal Periksa:</strong> {detail.tgl_periksa}</p>
              <p className="text-gray-600"><strong>Catatan:</strong> {detail.catatan}</p>
              <p className="text-gray-600"><strong>Nomor Antrian:</strong> {detail.no_antrian}</p>
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Obat</h3>
              {detail.obat?.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {detail.obat.map((obat, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{obat.nama_obat}</span>
                      <span className="font-medium">Rp {obat.harga}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Tidak ada obat yang diresepkan.</p>
              )}
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Total Biaya</h3>
              <p className="text-gray-700 text-xl font-bold">Rp {detail.biaya_periksa}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Memuat detail riwayat...</p>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailRiwayatPasien;
