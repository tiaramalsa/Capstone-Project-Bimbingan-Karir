import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './component/Sidebar'
import PageAdminDashboard from './page/PageAdminDashboard';
import PageAdminDokter from './page/PageAdminDokter';
import PageAdminPasien from './page/PageAdminPasien';
import PageAdminPoli from './page/PageAdminPoli';
import PageAdminObat from './page/PageAdminObat';
import PageLoginUser from './page/PageLoginUser';
import PageRegisterUser from './page/PageRegisterUser';
import PageLogin from './page/PageLogin';
import PageUserDashboard from './page/PageUserDashboard';
import PageDoctorDashboard from './page/PageDoctorDashboard';
import PagePasienDashboard from './page/PagePasienDashboard';
import PagePasienDaftarPoli from './page/PagePasienDaftarPoli';
import PageDoctorProfile from './page/PageDoctorProfile';
import PagePasienProfile from './page/PagePasienProfile';
import PageDoctorJadwalPeriksa from './page/PageDoctorJadwalPeriksa';
import PageDoctorDaftarPeriksa from './page/PageDoctorDaftarPeriksa';
import PageDoctorDetailPeriksa from './page/PageDoctorDetailPeriksa';
import PageDoctorRiwayat from './page/PageDoctorRiwayat';
import PageDetailRiwayatPasien from './page/PageDetailRiwayatPasien';
import PagePasienDetailRiwayat from './page/PagePasienDetailRiwayat';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<PageUserDashboard />} />
            <Route path="/dashboardadmin" element={<PageAdminDashboard />} />
            <Route path="/dokter" element={<PageAdminDokter />} />
            <Route path="/pasien" element={<PageAdminPasien />} />
            <Route path="/poli" element={<PageAdminPoli />} />
            <Route path="/obat" element={<PageAdminObat />} />
            <Route path="/registeruser" element={<PageRegisterUser />} />
            <Route path="/loginuser" element={<PageLoginUser />} />
            <Route path="/login" element={<PageLogin />} />
            <Route path="/dokter/:id/dashboarddokter" element={<PageDoctorDashboard />} />
            <Route path="/pasien/:id/dashboardpasien" element={<PagePasienDashboard />} />
            <Route path="/pasien/:id/daftarpoli" element={<PagePasienDaftarPoli />} />
            <Route path="/dokter/:id/profildokter" element={<PageDoctorProfile />} />
            <Route path="/pasien/:id/profilpasien" element={<PagePasienProfile />} />
            <Route path="/dokter/:id/jadwalperiksadokter" element={<PageDoctorJadwalPeriksa />} />
            <Route path="dokter/:id/daftarperiksadokter" element={<PageDoctorDaftarPeriksa />} />
            <Route path="/detailperiksadokter/:id" element={<PageDoctorDetailPeriksa />} />
            <Route path="/detailperiksadokter/edit/:id" element={<PageDoctorDetailPeriksa />} />
            <Route path="/dokter/:id/riwayatpasien" element={<PageDoctorRiwayat />} />
            <Route path="/dokter/:id/riwayatpasien/detail/:idPeriksa" element={<PageDetailRiwayatPasien />} />
            <Route path="/pasien/:idPasien/riwayat/detail/:idPeriksa" element={<PagePasienDetailRiwayat />} />
          </Routes>
    </Router>
    </>
  )
}

export default App
