import React, { useState, useEffect } from "react";
import axios from "axios";

const Obat = () => {
  const [obats, setObats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    nama_obat: "",
    kemasan: "",
    harga: "",
  });

  const apiBaseUrl = "http://localhost:8000/api/obaties";

  useEffect(() => {
    fetchObats();
  }, []);

  const fetchObats = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setObats(response.data);
    } catch (error) {
      console.error("Error fetching obats:", error);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: null, nama_obat: "", kemasan: "", harga: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (obat) => {
    setIsEditMode(true);
    setFormData(obat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, nama_obat: "", kemasan: "", harga: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "harga" ? Math.abs(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update obat
        await axios.put(`${apiBaseUrl}/${formData.id}`, {
          nama_obat: formData.nama_obat,
          kemasan: formData.kemasan,
          harga: Number(formData.harga),
        });
      } else {
        // Tambah obat baru
        await axios.post(apiBaseUrl, {
          nama_obat: formData.nama_obat,
          kemasan: formData.kemasan,
          harga: Number(formData.harga),
        });
      }
      fetchObats();
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      setObats(obats.filter((obat) => obat.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error.response?.data || error.message);
    }
  };

  return (
    <div className="ml-80 mr-20">
      {/* <h1 className="text-2xl font-bold mb-4">Obat</h1> */}
      <div className="flex justify-between items-center mb-4 pt-6 mt-8">
        <h2 className="text-lg font-semibold">Daftar Obat</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Tambah Obat
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Nama Obat</th>
              <th className="py-2 px-4 border-b">Kemasan</th>
              <th className="py-2 px-4 border-b">Harga</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {obats.map((obat) => (
              <tr key={obat.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-center">{obat.nama_obat}</td>
                <td className="py-2 px-4 border-b text-center">{obat.kemasan}</td>
                <td className="py-2 px-4 border-b text-center">Rp {obat.harga.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => openEditModal(obat)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(obat.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Data Obat" : "Tambah Data Obat"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Nama Obat</label>
                <input
                  type="text"
                  name="nama_obat"
                  value={formData.nama_obat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Kemasan</label>
                <input
                  type="text"
                  name="kemasan"
                  value={formData.kemasan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Harga</label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Obat;
