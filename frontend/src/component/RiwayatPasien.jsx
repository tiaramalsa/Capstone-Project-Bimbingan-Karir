import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const RiwayatPasien = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRiwayatByDokter = async () => {
      try {
          const storedDokter = localStorage.getItem("dokterId");
          if (!storedDokter) {
              setError("ID Dokter tidak ditemukan. Harap login ulang.");
              return;
          }
  
          const dokterData = JSON.parse(storedDokter);
          const idDokter = dokterData.id;
  
          console.log("Memuat riwayat pasien untuk ID Dokter:", idDokter);
  
          const response = await axios.get(`/riwayatpasien/riwayat/dokter/${idDokter}`);
          console.log("Data Riwayat dari Backend:", response.data);
          if (response.data && response.data.length > 0) {
              setRiwayat(response.data);
          } else {
              setError("Tidak ada data riwayat ditemukan.");
          }
      } catch (err) {
          console.error("Error memuat data:", err.response || err.message);
          setError("Gagal memuat data riwayat. Periksa koneksi atau hubungi admin.");
      }
  };
  

    fetchRiwayatByDokter();
  }, []);

  const handleDetailClick = (idPeriksa) => {
    console.log("ID Periksa yang Diterima:", idPeriksa);
    const idDokter = JSON.parse(localStorage.getItem("dokterId"))?.id;
    navigate(`/dokter/${idDokter}/riwayatpasien/detail/${idPeriksa}`); // Gunakan idPeriksa
  };
  
  
  
  return (
    <div className="container ml-60 p-8">
      <h2 className="text-xl font-bold mb-6">Riwayat Pasien</h2>
      {error && <div className="bg-red-500 text-white p-3 mb-4">{error}</div>}
      {riwayat.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">Nama Pasien</th>
              <th className="border border-gray-300 px-4 py-2">Alamat</th>
              <th className="border border-gray-300 px-4 py-2">No KTP</th>
              <th className="border border-gray-300 px-4 py-2">No HP</th>
              <th className="border border-gray-300 px-4 py-2">No RM</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{item.nama}</td>
                <td className="border border-gray-300 px-4 py-2">{item.alamat}</td>
                <td className="border border-gray-300 px-4 py-2">{item.no_ktp}</td>
                <td className="border border-gray-300 px-4 py-2">{item.no_hp}</td>
                <td className="border border-gray-300 px-4 py-2">{item.no_rm}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDetailClick(item.id_periksa)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Detail Riwayat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">Tidak ada data pasien untuk dokter ini.</p>
      )}
    </div>
  );
  
};

export default RiwayatPasien;
