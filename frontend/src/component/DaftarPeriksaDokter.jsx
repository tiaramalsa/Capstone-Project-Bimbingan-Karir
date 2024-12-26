import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const DaftarPeriksaDokter = () => {
  const navigate = useNavigate();
  const [dataPasien, setDataPasien] = useState([]);
  const [filterDate, setFilterDate] = useState(""); 
  const [error, setError] = useState("");

  const fetchData = async (tanggal = "") => {
    try {
      const dokterData = JSON.parse(localStorage.getItem("dokterId"));
      if (!dokterData || !dokterData.id) {
        throw new Error("ID dokter tidak ditemukan di localStorage.");
      }

      const response = await axios.get(`/periksa/dokter/${dokterData.id}`, {
        params: { tanggal },
      });
      setDataPasien(response.data);
      setError("");
    } catch (err) {
      console.error("Gagal memuat data pasien:", err.response || err.message);
      setError("Gagal memuat data pasien. Pastikan dokter login.");
    }
  };

  useEffect(() => {
    fetchData(filterDate);
  }, [filterDate]);

  const handlePeriksa = (id) => {
    navigate(`/detailperiksadokter/${id}`);
  };

  return (
    <div className="container mx-auto ml-60 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daftar Periksa Pasien</h2>

        <div>
          <label htmlFor="filterDate" className="mr-2 font-medium">
            Filter Tanggal:
          </label>
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {error && <div className="bg-red-500 text-white p-3 mb-4">{error}</div>}

      {/* Tabel Daftar Periksa */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border p-2">No Antrian</th>
            <th className="border p-2">Nama Pasien</th>
            <th className="border p-2">Keluhan</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataPasien.length > 0 ? (
            dataPasien.map((pasien) => (
              <tr key={pasien.id} className="even:bg-gray-100">
                <td className="border p-2 text-center">{pasien.no_antrian}</td>
                <td className="border p-2">{pasien.nama_pasien}</td>
                <td className="border p-2">{pasien.keluhan}</td>
                <td className="border p-2 text-center">{pasien.created_at}</td>
                <td className="border p-2 text-center">
                  {pasien.status === "Sudah Diperiksa" ? (
                    <button
                      onClick={() => navigate(`/detailperiksadokter/edit/${pasien.id}`)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePeriksa(pasien.id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Periksa
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Tidak ada data pasien untuk tanggal {filterDate || "terpilih"}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DaftarPeriksaDokter;
