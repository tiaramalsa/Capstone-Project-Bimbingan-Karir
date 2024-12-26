import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const DetailPeriksaDokter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const isEditMode = location.pathname.includes("edit");
  const doctorId = JSON.parse(localStorage.getItem("dokterId"))?.id;

  const [formData, setFormData] = useState({
    namaPasien: "",
    keluhan: "",
    tglPeriksa: "",
    jamPeriksa: "",
    catatan: "",
    obat: [],
    biayaPeriksa: 150000,
  });

  const [obatList, setObatList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    console.log("ID Pemeriksaan dari URL:", id);
    if (!id) {
      setFetchError("ID pasien tidak valid.");
      return;
    }

    const fetchDetails = async () => {
      console.log("Memanggil API untuk ID Periksa:", id);
      setLoading(true);
      try {
        const response = await axios.get(`/periksa/${id}`);
        const data = response.data;

        setFormData((prev) => ({
          ...prev,
          namaPasien: data.nama_pasien || "Tidak ditemukan",
          keluhan: data.keluhan || "Tidak ada keluhan",
          catatan: data.catatan || "",
          tglPeriksa: data.tgl_periksa?.split(" ")[0] || "",
          jamPeriksa: data.tgl_periksa?.split(" ")[1] || "",
          obat: data.obat || [],
          biayaPeriksa: data.biaya_periksa || prev.biayaPeriksa,
        }));

        setObatList(data.obat_list || []);
        setFetchError("");
      } catch (err) {
        setFetchError(err.response?.data?.message || "Gagal mengambil data pasien.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const buttonObat = (obat) => {
    const isSelected = formData.obat.some((item) => item.id === obat.id);
    const updatedObat = isSelected
      ? formData.obat.filter((item) => item.id !== obat.id)
      : [...formData.obat, obat];

    const totalHargaObat = updatedObat.reduce((total, item) => total + item.harga, 0);

    setFormData((prev) => ({
      ...prev,
      obat: updatedObat,
      biayaPeriksa: 150000 + totalHargaObat,
    }));
  };

  const buttonSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      alert("ID dokter tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (!formData.tglPeriksa || !formData.jamPeriksa) {
      alert("Tanggal dan jam periksa harus diisi.");
      return;
    }

    try {
      const pemeriksaanPayload = {
        id_daftar_poli: id,
        tgl_periksa: `${formData.tglPeriksa} ${formData.jamPeriksa}`,
        catatan: formData.catatan || "",
        biaya_periksa: formData.biayaPeriksa,
        obat: formData.obat.map((item) => item.id),
      };

      if (isEditMode) {
        await axios.put(`/periksa/edit/${id}`, pemeriksaanPayload);
        console.log("URL API:", `/periksa/edit/${id}`);
      } else {
        await axios.post("/periksa", pemeriksaanPayload);

        const statusPayload = { status: "Sudah Diperiksa" };
        await axios.put(`/daftar-poli/${id}/status`, statusPayload);
      }

      navigate(`/dokter/${doctorId}/daftarperiksadokter`, { state: { updatedId: id } });
    } catch (err) {
      setFetchError("Gagal menyimpan data pemeriksaan. Periksa kembali input Anda.");
      console.error("Error response data:", err.response?.data || err.message);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> 
      </div>
    );
  }

  return (
    <div className="container ml-64 w-9/12 p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-6">
        {isEditMode ? "Edit Periksa Pasien" : "Detail Periksa Pasien"}
      </h2>

      {fetchError && <div className="text-red-500 mb-4">{fetchError}</div>}

      <form onSubmit={buttonSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nama Pasien</label>
          <input
            type="text"
            value={formData.namaPasien}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Keluhan</label>
          <input
            type="text"
            value={formData.keluhan}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tanggal dan Jam Periksa</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={formData.tglPeriksa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tglPeriksa: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="time"
              value={formData.jamPeriksa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, jamPeriksa: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Catatan</label>
          <textarea
            value={formData.catatan}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, catatan: e.target.value }))
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Obat</label>
          <div
            className="w-full p-2 border rounded bg-white cursor-pointer"
            onClick={() => setDropdownVisible((prev) => !prev)}
          >
            Pilih Obat
          </div>
          {dropdownVisible && (
            <div className="absolute z-10 w-full border bg-white rounded mt-1 shadow-md">
              {obatList.length > 0 ? (
                obatList.map((obat) => (
                  <div
                    key={obat.id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => buttonObat(obat)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.obat.some((item) => item.id === obat.id)}
                      readOnly
                      className="mr-2"
                    />
                    <label>
                      {obat.nama_obat} - Rp {obat.harga}
                    </label>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">Tidak ada obat tersedia.</div>
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.obat.map((item) => (
              <div
                key={item.id}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {item.nama_obat}
                <button
                  onClick={() => buttonObat(item)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Biaya Periksa</label>
          <input
            type="number"
            value={formData.biayaPeriksa}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default DetailPeriksaDokter;