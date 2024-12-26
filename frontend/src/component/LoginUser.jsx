import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginUser = () => {
  const [formData, setFormData] = useState({
    no_ktp: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validasi input sebelum submit
  const validateForm = () => {
    const { no_ktp, password } = formData;

    if (!/^\d+$/.test(no_ktp)) {
      setMessage("Nomor KTP harus berupa angka.");
      return false;
    }

    if (password.length < 8) {
      setMessage("Password harus memiliki minimal 8 karakter.");
      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset pesan

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8000/api/loginuser", formData);

      if (response.status === 200) {
        // Jika login berhasil, simpan data pengguna
        setUserData(response.data.pasien);
        localStorage.setItem("pasienId", JSON.stringify(response.data.pasien)); // Simpan di localStorage
        setMessage(`Login berhasil! Selamat datang, ${response.data.pasien.nama}`);
        navigate(`/pasien/${response.data.pasien.id}/profilpasien`);
      } else {
        setMessage(response.data.message || "Login gagal.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat mencoba login."
      );
    }
  };
  const redirectToAdminLogin = () =>{
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-11 md:w-auto">
      <div className="w-6/12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Login
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
        {userData && (
          <div className="text-left mt-4 bg-green-100 border border-green-500 p-4 rounded">
            <p>
              <strong>Nama:</strong> {userData.nama}
            </p>
            <p>
              <strong>Nomor Rekam Medis:</strong> {userData.no_rm}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            Masuk
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Belum registrasi?{" "}
          <a
            href="/registeruser"
            className="text-blue-800 font-medium hover:underline"
          >
            Klik di sini untuk daftar
          </a>
        </p>
        {/* <button
            onClick={redirectToAdminLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transform transition duration-300 hover:scale-105 mt-8"
          >
            Login sebagai Admin
          </button> */}
      </div>
    </div>
  );
};

export default LoginUser;