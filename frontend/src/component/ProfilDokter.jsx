import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilDokter = () => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    no_hp: "",
    poli: "",
    id_poli: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const storedDoctor = localStorage.getItem("dokterId");
      if (!storedDoctor) {
        setError("Data dokter tidak ditemukan di localStorage.");
        return;
      }

      const { id } = JSON.parse(storedDoctor);
      const response = await axios.get(`http://localhost:8000/api/dokters/${id}`);
      
      setFormData({
        nama: response.data.nama,
        alamat: response.data.alamat,
        no_hp: response.data.no_hp,
        poli: response.data.poli.nama_poli,
        id_poli: response.data.poli.id,
      });
    } catch (err) {
      setError("Gagal memuat data profil.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.nama || !formData.alamat || !formData.no_hp) {
      setError("Semua field wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      const storedDoctor = localStorage.getItem("dokterId");
      if (!storedDoctor) {
        setError("Data dokter tidak ditemukan di localStorage.");
        return;
      }

      const { id } = JSON.parse(storedDoctor);
      await axios.put(`http://localhost:8000/api/dokters/${id}`, {
        nama: formData.nama,
        alamat: formData.alamat,
        no_hp: formData.no_hp,
        id_poli: formData.id_poli,
      });
      alert("Profil berhasil diperbarui.");
      setIsEditing(false);
    } catch (err) {
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Profil Dokter</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-500">Memuat...</p>
        </div>
      ) : (
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poli Field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">Poli</label>
              <input
                type="text"
                value={formData.poli || "Belum ada data poli"}
                disabled
                className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            {/* Other Fields */}
            {["nama", "alamat", "no_hp"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border px-4 py-2 rounded-md ${
                    !isEditing ? "bg-gray-100 text-gray-600" : "focus:outline-blue-500"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit Profil
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilDokter;
