import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const DaftarPoli = () => {
  const [pasien, setPasien] = useState(null);
  const [poliList, setPoliList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [riwayatPoli, setRiwayatPoli] = useState([]);
  const [selectedRiwayat, setSelectedRiwayat] = useState(null);
  const [form, setForm] = useState({
    id_pasien: "",
    id_poli: "",
    id_jadwal: "",
    keluhan: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchPasien = async () => {
      try {
        const pasienData = JSON.parse(localStorage.getItem("pasienId"));
  
        if (!pasienData || !pasienData.id) {
          console.error("ID pasien tidak ditemukan.");
          return;
        }
  
        const response = await axios.get(`/pasiens/${pasienData.id}`);
        setPasien(response.data);

        setForm((prevForm) => ({ ...prevForm, id_pasien: response.data.id }));
      } catch (error) {
        console.error("Gagal memuat informasi pasien:", error.response || error);
        setError("Gagal memuat data pasien.");
      }
    };

    fetchPasien();
  }, []);

  const fetchPoliList = async () => {
    try {
      const response = await axios.get("/polies");
      setPoliList(response.data);
    } catch (err) {
      console.error("Error fetching Poli List:", err.response || err);
      setError("Gagal memuat daftar poli. Pastikan server berjalan dan endpoint '/poli' tersedia.");
    }
  };

  const fetchJadwalList = async (idPoli) => {
    try {
      const response = await axios.get(`/jadwal-periksa/poli/${idPoli}`);
      setJadwalList(response.data); 
    } catch (err) {
      console.error("Error fetching Jadwal List:", err.response || err);
      setError("Belum Tersedia Jadwal Periksa Untuk Poli Tersebut.");
    }
  };

  const fetchRiwayatPoli = async (idPasien) => {
    try {
      const response = await axios.get(`/riwayatpoli/${idPasien}`);
      console.log("Respons Riwayat Poli:", response.data);
  
      setRiwayatPoli(response.data);
    } catch (e) {
      console.error("Error fetching riwayat poli:", e.message);
      setError("Gagal memuat riwayat poli.");
    }
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePoliChange = (poliId) => {
    setForm({ ...form, id_poli: poliId, id_jadwal: "" });
    fetchJadwalList(poliId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!form.id_poli || !form.id_jadwal || !form.keluhan) {
      setError("Harap isi semua kolom yang diperlukan.");
      return;
    }
  
    try {
      // Ambil nomor antrian dari backend
      const antrianResponse = await axios.get(`/generate-no-antrian/${form.id_jadwal}`);
      const noAntrian = antrianResponse.data.no_antrian;
  
      const payload = {
        id_pasien: form.id_pasien,
        id_jadwal: form.id_jadwal,
        keluhan: form.keluhan,
        no_antrian: noAntrian,
      };

      const response = await axios.post("/daftar-poli", payload);
  
      if (response.status === 200 && response.data.message) {
        setSuccess(response.data.message);
      } else {
        setSuccess("Pendaftaran poli berhasil!");
      }
  
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      
      fetchRiwayatPoli(form.id_pasien);
      setForm({
        id_pasien: form.id_pasien,
        id_poli: "",
        id_jadwal: "",
        keluhan: "",
      });
      setJadwalList([]);
    } catch (e) {
      console.error("Error submitting pendaftaran poli:", e.response?.data || e.message);
      setError("Gagal mendaftarkan poli. Silakan coba lagi.");
    }
  };
  
  const handleRiwayatClick = async (idDaftarPoli) => {
    console.log("ID Daftar Poli yang Diterima:", idDaftarPoli); 
  
    const idPasien = JSON.parse(localStorage.getItem("pasienId"))?.id;
    console.log("ID Pasien dari localStorage:", idPasien); 
  
    if (!idPasien || !idDaftarPoli) {
      console.error("ID Pasien atau ID Daftar Poli tidak valid:", { idPasien, idDaftarPoli });
      setError("ID Pasien atau ID Daftar Poli tidak valid.");
      return;
    }
  
    try {
      const response = await axios.get(`/daftar-poli/${idDaftarPoli}/periksa`);
      const idPeriksa = response.data?.id_periksa;
  
      if (!idPeriksa) {
        console.error("ID Periksa tidak ditemukan untuk ID Daftar Poli:", idDaftarPoli);
        setError("ID Periksa tidak ditemukan.");
        return;
      }
  
      const targetUrl = `/pasien/${idPasien}/riwayat/detail/${idPeriksa}`;
      console.log("Navigating to:", targetUrl); 
  
      navigate(targetUrl);
    } catch (error) {
      console.error("Error fetching ID Periksa:", error.response || error);
      setError("Gagal memuat Riwayat karena Status Belum Di Periksa.");
    }
  };
  
  
  useEffect(() => {
    fetchPoliList();
  }, []);
  useEffect(() => {
    if (pasien?.id) {
      console.log("Pasien ID:", pasien.id);
      fetchRiwayatPoli(pasien.id);
    }
  }, [pasien]);
  useEffect(() => {
    console.log("Data Riwayat Poli:", riwayatPoli);
  }, [riwayatPoli]);

  return (
    <div className="flex h-screen">
      <div className="w-60 bg-blue-600 text-white flex-shrink-0">
        <div className="p-4 text-xl font-bold">Poliklinik BK</div>
        <ul className="mt-6">
          <li className="p-2 hover:bg-blue-700 cursor-pointer">Dashboard</li>
          <li className="p-2 bg-blue-700 cursor-pointer">Poli</li>
        </ul>
      </div>

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">Daftar Poli</h1>

        {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}
        {success && <div className="bg-green-500 text-white p-2 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Nomor Rekam Medis</label>
              <input
                type="text"
                value={pasien?.no_rm || ""}
                readOnly
                className="w-full p-2 border rounded-md bg-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Pilih Poli</label>
              <select
                name="id_poli"
                value={form.id_poli}
                onChange={(e) => handlePoliChange(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">-- Pilih Poli --</option>
                {poliList.map((poli) => (
                  <option key={poli.id} value={poli.id}>
                    {poli.nama_poli}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Pilih Jadwal</label>
              <select
                name="id_jadwal"
                value={form.id_jadwal}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">-- Pilih Jadwal --</option>
                {jadwalList.map((jadwal) => (
                  <option key={jadwal.id} value={jadwal.id}>
                    {jadwal.hari} ({jadwal.jam_mulai} - {jadwal.jam_selesai})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Keluhan</label>
              <textarea
                name="keluhan"
                value={form.keluhan}
                onChange={handleInputChange}
                placeholder="Tulis keluhan pasien..."
                className="w-full p-2 border rounded-md"
                rows="3"
                required
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Daftar
          </button>
        </form>

        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Riwayat Daftar Poli</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border p-2 text-center">No</th>
                <th className="border p-2 text-left">Poli</th>
                <th className="border p-2 text-left">Dokter</th>
                <th className="border p-2 text-center">Hari</th>
                <th className="border p-2 text-center">Mulai</th>
                <th className="border p-2 text-center">Selesai</th>
                <th className="border p-2 text-center">Antrian</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
  {riwayatPoli.length > 0 ? (
    riwayatPoli.map((item, index) => {
      console.log("Riwayat Poli Item:", item); 

      return (
        <tr key={item.id} className="even:bg-gray-50">
          <td className="border p-2 text-center">{index + 1}</td>
          <td className="border p-2">{item.Poli}</td>
          <td className="border p-2">{item.Dokter}</td>
          <td className="border p-2 text-center">{item.Hari}</td>
          <td className="border p-2 text-center">{item.Mulai}</td>
          <td className="border p-2 text-center">{item.Selesai}</td>
          <td className="border p-2 text-center">{item.Antrian}</td>
          <td className="border p-2 text-center">
            {item.Status?.trim() || "Belum Diperiksa"}
          </td>
          <td className="border p-2 text-center">
            <button
              onClick={() => handleRiwayatClick(item.id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Riwayat
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td className="border p-2 text-center" colSpan="8">
        {error || "Tidak ada riwayat poli."}
      </td>
    </tr>
  )}
            </tbody>


          </table>

          {selectedRiwayat && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <h3 className="text-lg font-semibold">Riwayat Pemeriksaan</h3>
              <pre>{JSON.stringify(selectedRiwayat, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarPoli;
