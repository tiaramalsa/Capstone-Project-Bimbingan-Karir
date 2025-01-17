import React, { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const JadwalPeriksaDokter = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
    status: "aktif",
  });
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [dokter, setDokter] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hariOptions = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  useEffect(() => {
    const storedDokter = localStorage.getItem("dokterId");
    if (storedDokter) {
      const parsedDokter = JSON.parse(storedDokter);
      setDokter(parsedDokter);
      console.log("Dokter berhasil dimuat:", parsedDokter);
    } else {
      setError("Data dokter tidak ditemukan. Silakan login ulang.");
    }}, []);
  const fetchJadwal = async () => {
    if (!dokter) return;
    try {
      const response = await axios.get("/jadwal-periksa", {
        params: { id_dokter: dokter.id },
      });
      setData(response.data || []);
      setError("");
    } catch (err) {
      setError("Gagal memuat jadwal periksa.");
    }
  };

  useEffect(() => {
    if (dokter) fetchJadwal();
  }, [dokter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.jam_mulai >= form.jam_selesai) {
      setError("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    try {
      const payload = {
        ...form,
        id_dokter: dokter.id,
      };

      if (selectedJadwal) {
        await axios.put(`/jadwal-periksa/${selectedJadwal.id}`, payload);
        alert("Jadwal berhasil diperbarui.");
      } else {
        await axios.post("/jadwal-periksa", payload);
        alert("Jadwal berhasil ditambahkan.");
      }

      fetchJadwal();
      setShowModal(false);
      resetForm();
    } catch (err) {
      if (err.response && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        setError("Gagal menyimpan jadwal. Periksa input Anda.");
      }
      // console.error("Error saving jadwal:", err.response?.data || err.message);
      // setError("Gagal menyimpan jadwal. Periksa input Anda.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      try {
        await axios.delete(`/jadwal-periksa/${id}`);
        alert("Jadwal berhasil dihapus.");
        fetchJadwal();
      } catch (error) {
        console.error("Error deleting jadwal:", error);
        setError("Gagal menghapus jadwal.");
      }
    }
  };

  const handleEdit = (jadwal) => {
    setForm({
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai,
      status: jadwal.status,
    });
    setSelectedJadwal(jadwal);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      hari: "",
      jam_mulai: "",
      jam_selesai: "",
      status: "aktif",
    });
    setSelectedJadwal(null);
  };

  return (
    <>
      <div className="container ml-60 p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Jadwal Periksa - {dokter?.nama || "Loading..."}</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
          >
            + Tambah Jadwal
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Hari</th>
              <th className="border border-gray-300 p-2">Jam Mulai</th>
              <th className="border border-gray-300 p-2">Jam Selesai</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2">{row.hari}</td>
                <td className="border border-gray-300 p-2 text-center">{row.jam_mulai}</td>
                <td className="border border-gray-300 p-2 text-center">{row.jam_selesai}</td>
                <td className="border border-gray-300 p-2 text-center">{row.status}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => handleEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 ml-2"
                    onClick={() => handleDelete(row.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">
                {selectedJadwal ? "Edit Jadwal Periksa" : "Tambah Jadwal Periksa"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Hari</label>
                  <select
                    name="hari"
                    value={form.hari}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Pilih Hari</option>
                    {hariOptions.map((hari) => (
                      <option key={hari} value={hari}>
                        {hari}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700">Jam Mulai</label>
                    <input
                      type="time"
                      name="jam_mulai"
                      value={form.jam_mulai}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700">Jam Selesai</label>
                    <input
                      type="time"
                      name="jam_selesai"
                      value={form.jam_selesai}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="aktif">aktif</option>
                    <option value="non-aktif">tidak aktif</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JadwalPeriksaDokter;
