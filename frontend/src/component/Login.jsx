import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    role: "dokter",
    username_or_name: "",
    password_or_no_hp: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", formData, {
        headers: { Accept: "application/json" },
      });

      if (response.status === 200 && response.data.user) {
        const user = response.data.user;

        localStorage.setItem("userId", user.id);

        
        if (formData.role === "dokter") {
          localStorage.setItem("dokterId", JSON.stringify(response.data.user));

          navigate(`/dokter/${user.id}/profildokter`);
        } else if (formData.role === "admin") {
          navigate(`/dashboardadmin`);
        } else {
          setMessage("Role tidak dikenali. Silakan periksa kembali.");
        }
      } else {
        setMessage("Login gagal atau data tidak ditemukan.");
      }
    } catch (error) {
      setMessage(error.response?.data.message || "Login gagal.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center p-11">
      <div className="w-6/12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Login</h2>
        {message && (
          <p
            className={`text-center mt-4 ${
              message.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-left font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="admin">Admin</option>
              <option value="dokter">Dokter</option>
            </select>
          </div>
          <div>
            <label htmlFor="username_or_name" className="block text-left font-medium text-gray-700">
              {formData.role === "admin" ? "Username" : "Nama"}
            </label>
            <input
              type="text"
              id="username_or_name"
              name="username_or_name"
              value={formData.username_or_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder={`Masukkan ${formData.role === "admin" ? "username" : "nama"} Anda`}
              required
            />
          </div>
          <div>
            <label htmlFor="password_or_no_hp" className="block text-left font-medium text-gray-700">
              {formData.role === "admin" ? "Password" : "No HP"}
            </label>
            <input
              type={formData.role === "admin" ? "password" : "text"}
              id="password_or_no_hp"
              name="password_or_no_hp"
              value={formData.password_or_no_hp}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder={`Masukkan ${formData.role === "admin" ? "password" : "no HP"} Anda`}
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
      </div>
    </div>
  );
};

export default Login;
