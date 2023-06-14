import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLoginPage from "./pages/auth/AuthLoginPages";
import UserPage from "./pages/user/UserPage";
import UserAddPage from "./pages/user/UserAddPage";
import ProfilPage from "./pages/profil/ProfilPage";
import KaryawanPage from "./pages/karyawan/KaryawanPage";
import JabatanPage from "./pages/jabatan/JabatanPage";
import GolonganPage from "./pages/golongan/GolonganPage";
import PendapatanPage from "./pages/pendapatan/PendapatanPage";
import PotonganPage from "./pages/potongan/PotonganPage";
import LaporanGajiPage from "./pages/laporan/LaporanGajiPage";
import KaryawanAddPage from "./pages/karyawan/KaryawanAddPage";
import PenggajianInputPage from "./pages/penggajian/PenggajianInputPage";
import PenggajianListPage from "./pages/penggajian/PenggajianListPage";
import JabatanAddPage from "./pages/jabatan/JabatanAddPage";
import GolonganAddPage from "./pages/golongan/GolonganAddPage";
import PendapatanAddPage from "./pages/pendapatan/PendapatanAddPage";
import PotonganAddPage from "./pages/potongan/PotonganAddPage";
import ProfilAddPage from "./pages/profil/ProfilAddPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user/add" element={<UserAddPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/profil/add" element={<ProfilAddPage />} />
        <Route path="/karyawan" element={<KaryawanPage />} />
        <Route path="/karyawan/add" element={<KaryawanAddPage />} />
        <Route path="/jabatan" element={<JabatanPage />} />
        <Route path="/jabatan/add" element={<JabatanAddPage />} />
        <Route path="/golongan" element={<GolonganPage />} />
        <Route path="/golongan/add" element={<GolonganAddPage />} />
        <Route path="/pendapatan" element={<PendapatanPage />} />
        <Route path="/pendapatan/add" element={<PendapatanAddPage />} />
        <Route path="/potongan" element={<PotonganPage />} />
        <Route path="/potongan/add" element={<PotonganAddPage />} />
        <Route path="/laporan" element={<LaporanGajiPage />} />
        <Route path="/penggajian" element={<PenggajianListPage />} />
        <Route path="/penggajian/add" element={<PenggajianInputPage />} />
        <Route path="/laporan" element={<LaporanGajiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
