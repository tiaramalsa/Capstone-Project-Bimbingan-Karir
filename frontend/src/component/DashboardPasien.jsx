import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

axios.defaults.baseURL = "http://localhost:8000/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPasien = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [poliCount, setPoliCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: doctorsData } = await axios.get("/doctors/count");
        setDoctorCount(doctorsData.count);

        const { data: patientsData } = await axios.get("/patients/count");
        setPatientCount(patientsData.count);

        const { data: poliesData } = await axios.get("/poli/count");
        setPoliCount(poliesData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Dokter", "Pasien", "Poliklinik"],
    datasets: [
      {
        label: "Jumlah",
        data: [doctorCount, patientCount, poliCount],
        backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Statistik Rumah Sakit",
      },
    },
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="container w-full pl-48 mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Dashboard Pasien</h1>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Jumlah Dokter</h2>
            <p className="text-4xl font-bold text-blue-600 mt-4">{doctorCount}</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Jumlah Pasien</h2>
            <p className="text-4xl font-bold text-green-500 mt-4">{patientCount}</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Jumlah Poliklinik</h2>
            <p className="text-4xl font-bold text-orange-500 mt-4">{poliCount}</p>
          </div>
        </div>

        {/* Grafik Statistik */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Grafik Statistik</h2>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardPasien;
