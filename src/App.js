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
import KaryawanEditPage from "./pages/karyawan/KaryawanEditPage";
import JabatanEditPage from "./pages/jabatan/JabatanEditPage";
import GolonganEditPage from "./pages/golongan/GolonganEditPage";
import PendapatanEditPage from "./pages/pendapatan/PendapatanEditPage";
import PotonganEditPage from "./pages/potongan/PotonganEditPage";





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
        <Route path="/karyawan/edit/:ID_Karyawan" element={<KaryawanEditPage />} />
        <Route path="/jabatan" element={<JabatanPage />} />
        <Route path="/jabatan/add" element={<JabatanAddPage />} />
        <Route path="/jabatan/edit/:ID_Jabatan" element={<JabatanEditPage />} />
        <Route path="/golongan" element={<GolonganPage />} />
        <Route path="/golongan/add" element={<GolonganAddPage />} />
        <Route path="/golongan/edit/:ID_Golongan" element={<GolonganEditPage />} />
        <Route path="/pendapatan" element={<PendapatanPage />} />
        <Route path="/pendapatan/add" element={<PendapatanAddPage />} />
        <Route path="/pendapatan/edit/:ID_Pendapatan" element={<PendapatanEditPage />} />
        <Route path="/potongan" element={<PotonganPage />} />
        <Route path="/potongan/add" element={<PotonganAddPage />} />
        <Route path="/potongan/edit/:ID_Potongan" element={<PotonganEditPage />} />    <Route path="/potongan/add" element={<PotonganAddPage />} />
        <Route path="/penggajian" element={<PenggajianListPage />} />
        <Route path="/penggajian/input" element={<PenggajianInputPage />} />
        <Route path="/laporan" element={<LaporanGajiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
