import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilPasien = () => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    no_ktp: "",
    no_hp: "",
    no_rm: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const storedPasien = localStorage.getItem("pasienId");
      if (!storedPasien) {
        setError("Data pasien tidak ditemukan di localStorage.");
        return;
      }

      const { id } = JSON.parse(storedPasien);
      const response = await axios.get(`http://localhost:8000/api/pasiens/${id}`);
      setFormData({
        nama: response.data.nama,
        alamat: response.data.alamat,
        no_ktp: response.data.no_ktp,
        no_hp: response.data.no_hp,
        no_rm: response.data.no_rm,
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
    if (!formData.nama || !formData.alamat || !formData.no_ktp || !formData.no_hp) {
      setError("Semua field wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      const storedPasien = localStorage.getItem("pasienId");
      if (!storedPasien) {
        setError("Data pasien tidak ditemukan di localStorage.");
        return;
      }

      const { id } = JSON.parse(storedPasien);
      await axios.put(`http://localhost:8000/api/pasiens/${id}`, formData);

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
    <>
    
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Profil Pasien</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {isLoading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* No Rekam Medis */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                No Rekam Medis
              </label>
              <input
                type="text"
                value={formData.no_rm || "Belum ada data"}
                disabled
                className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            {/* Input Fields */}
            {["nama", "alamat", "no_ktp", "no_hp"].map((field) => (
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
                  className={`w-full border px-3 py-2 rounded-md ${
                    !isEditing
                      ? "bg-gray-100 text-gray-600"
                      : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Simpan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profil
              </button>
            )}
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export default ProfilPasien;
