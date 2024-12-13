import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    alamat: "",
    no_ktp: "",
    no_hp: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [successData, setSuccessData] = useState(null); //simpan data yang berhasill login
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/register", formData);

      if (response.status === 201) {
        setMessage("Registrasi berhasil!");
        setSuccessData(response.data.pasien); // simpan data pasien

        setTimeout(() => {
          navigate("/loginuser");
        }, 3000);
      } else {
        setMessage(response.data.message || "Registrasi gagal.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat mengirim formulir."
      );
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-11">
      <div className="w-6/12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Registrasi
        </h2>
        {message && (
          <p
            className={`text-center mt-4 ${
              message.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        {successData && (
          <div className="text-center mt-4 bg-green-100 border border-green-500 p-4 rounded">
            <p>
              <strong>Nomor Rekam Medis:</strong> {successData.no_rm}
            </p>
            <p>Nama: {successData.nama}</p>
            <p>Alamat: {successData.alamat}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nama" className="block text-left font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          <div>
            <label htmlFor="alamat" className="block text-left font-medium text-gray-700">
              Alamat
            </label>
            <input
              type="text"
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Masukkan alamat Anda"
              required
            />
          </div>
          <div>
            <label htmlFor="no_ktp" className="block text-left font-medium text-gray-700">
              No KTP
            </label>
            <input
              type="text"
              id="no_ktp"
              name="no_ktp"
              value={formData.no_ktp}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Masukkan nomor KTP Anda"
              required
            />
          </div>
          <div>
            <label htmlFor="no_hp" className="block text-left font-medium text-gray-700">
              No HP
            </label>
            <input
              type="text"
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Masukkan nomor HP Anda"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-left font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Masukkan password Anda"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transform transition duration-300 hover:scale-105"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;