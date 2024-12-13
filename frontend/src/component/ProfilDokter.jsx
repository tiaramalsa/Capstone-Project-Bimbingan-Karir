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

  const dokterId = localStorage.getItem("dokterId");

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/dokters/${dokterId}`);
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
      await axios.put(`http://localhost:8000/api/dokters/${dokterId}`, {
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-blue-50 shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Profil Dokter</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <p>Memuat...</p>
      ) : (
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["nama", "alamat", "no_hp"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border px-3 py-2 rounded-md ${
                    !isEditing ? "bg-gray-100 text-gray-600" : "focus:outline-blue-500"
                  }`}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-2">Poli</label>
              <input
                type="text"
                value={formData.poli || "Belum ada data poli"}
                disabled
                className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-600"
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 mr-4"
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
  );
};

export default ProfilDokter;
