import React, { useState, useEffect } from "react";
import axios from "axios";

const Poli = () => {
  const [polikliniks, setPolikliniks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    nama_poli: "",
    keterangan: "",
  });

  const apiBaseUrl = "http://localhost:8000/api/polies";

  useEffect(() => {
    fetchPolikliniks();
  }, []);

  const fetchPolikliniks = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setPolikliniks(response.data);
    } catch (error) {
      console.error("Error fetching polikliniks:", error);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: null, nama_poli: "", keterangan: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (poliklinik) => {
    setIsEditMode(true);
    setFormData(poliklinik);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, nama_poli: "", keterangan: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${apiBaseUrl}/${formData.id}`, {
          nama_poli: formData.nama_poli,
          keterangan: formData.keterangan,
        });
      } else {
        await axios.post(apiBaseUrl, {
          nama_poli: formData.nama_poli,
          keterangan: formData.keterangan,
        });
      }
      fetchPolikliniks();
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      setPolikliniks(polikliniks.filter((poliklinik) => poliklinik.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="ml-80 mr-20">
      {/* <h1 className="text-2xl font-bold mb-4">Poliklinik</h1> */}
      <div className="flex justify-between items-center mb-4 pt-6 mt-8">
        <h2 className="text-lg font-semibold">Daftar Poliklinik</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Tambah Poliklinik
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Keterangan</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {polikliniks.map((poliklinik) => (
              <tr key={poliklinik.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-center">{poliklinik.nama_poli}</td>
                <td className="py-2 px-4 border-b text-center">{poliklinik.keterangan}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => openEditModal(poliklinik)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(poliklinik.id)}
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
              {isEditMode ? "Edit Data Poliklinik" : "Tambah Data Poliklinik"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Nama</label>
                <input
                  type="text"
                  name="nama_poli"
                  value={formData.nama_poli}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Keterangan</label>
                <textarea
                  type="text"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                ></textarea>
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

export default Poli;
