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
            <Route path="/dashboarddokter/:id" element={<PageDoctorDashboard />} />
            <Route path="/dashboardpasien" element={<PagePasienDashboard />} />
            <Route path="/daftarpoli" element={<PagePasienDaftarPoli />} />
            <Route path="/profildokter/:id" element={<PageDoctorProfile />} />
            <Route path="/profilpasien/:id" element={<PagePasienProfile />} />
          </Routes>
    </Router>
    </>
  )
}

export default App
