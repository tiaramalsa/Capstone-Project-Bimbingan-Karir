import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

axios.defaults.baseURL = "http://localhost:8000/api";

const DetailRiwayat = () => {
  const { idPasien, idPeriksa } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const pdfRef = useRef(); 

  useEffect(() => {
    const fetchDetailRiwayat = async () => {
      const pasienId = idPasien || JSON.parse(localStorage.getItem("pasienId"))?.id;

      if (!pasienId || !idPeriksa) {
        setError("ID Pasien atau ID Periksa tidak valid.");
        return;
      }

      try {
        const response = await axios.get(`/pasien/${pasienId}/riwayat/detail/${idPeriksa}`);
        if (response.status === 200 && response.data) {
          setDetail(response.data);
        } else {
          setError("Data detail riwayat tidak ditemukan.");
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Riwayat belum dapat diakses karena status belum diperiksa.");
        } else {
          setError("Gagal memuat detail riwayat. Periksa koneksi atau hubungi admin.");
        }
      }
    };

    fetchDetailRiwayat();
  }, [idPasien, idPeriksa]);

  const downloadPDF = async () => {
    const input = pdfRef.current;

    if (!input) {
      alert("Gagal membuat PDF. Pastikan data telah dimuat.");
      return;
    }

    try {
      const canvas = await html2canvas(input, { scale: 2 }); 
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Detail_Riwayat_${idPeriksa}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    }
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Detail Riwayat Pasien</h2>
          <p className="text-gray-600">Informasi lengkap tentang riwayat pemeriksaan</p>
        </div>
        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : detail ? (
          <div ref={pdfRef}>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Informasi Pasien</h3>
              <p className="text-gray-600 mt-2"><strong>Nama Poli:</strong> {detail.nama_poli}</p>
              <p className="text-gray-600"><strong>Nama Dokter:</strong> {detail.nama_dokter}</p>
              <p className="text-gray-600"><strong>Hari:</strong> {detail.hari}</p>
              <p className="text-gray-600"><strong>Jam:</strong> {detail.jam_mulai} - {detail.jam_selesai}</p>
              <p className="text-gray-600"><strong>Tanggal Periksa:</strong> {detail.tgl_periksa}</p>
              <p className="text-gray-600"><strong>Catatan:</strong> {detail.catatan}</p>
              <p className="text-gray-600"><strong>Nomor Antrian:</strong> {detail.no_antrian}</p>
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Obat</h3>
              {detail.obat?.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {detail.obat.map((obat, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{obat.nama_obat}</span>
                      <span className="font-medium">Rp {obat.harga}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Tidak ada obat yang diresepkan.</p>
              )}
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Total Biaya</h3>
              <p className="text-gray-700 text-xl font-bold">Rp {detail.biaya_periksa}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Memuat detail riwayat...</p>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Kembali
          </button>
          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default DetailRiwayat;
