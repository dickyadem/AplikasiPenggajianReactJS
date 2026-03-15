import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./widgets/commons/ToastProvider";
import Layout from "./widgets/commons/Layout";
import ProtectedRoute from "./widgets/commons/ProtectedRoute";
import AuthLoginPage from "./pages/auth/AuthLoginPages";

import Unauthorized from "./pages/auth/Unauthorized";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import RBACTestPage from "./pages/rbac/RBACTestPage";
import UserPage from "./pages/user/UserPage";
import UserAddPage from "./pages/user/UserAddPage";
import UserEditPage from "./pages/user/UserEditPage";
import ProfilPage from "./pages/profil/ProfilPage";
import ProfilAddPage from "./pages/profil/ProfilAddPage";
import ProfilEditPage from "./pages/profil/ProfilEditPage";
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
import KaryawanEditPage from "./pages/karyawan/KaryawanEditPage";
import JabatanEditPage from "./pages/jabatan/JabatanEditPage";
import GolonganEditPage from "./pages/golongan/GolonganEditPage";
import PendapatanEditPage from "./pages/pendapatan/PendapatanEditPage";
import PotonganEditPage from "./pages/potongan/PotonganEditPage";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/rbac-test" element={
                  <ProtectedRoute requiredRole="admin">
                    <RBACTestPage />
                  </ProtectedRoute>
                } />
                <Route path="/user" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager', 'finance', 'employee']}>
                    <UserPage />
                  </ProtectedRoute>
                } />
                <Route path="/user/add" element={
                  <ProtectedRoute requiredRole="admin">
                    <UserAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/user/edit/:email" element={
                  <ProtectedRoute requiredRole="admin">
                    <UserEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/profil" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <ProfilPage />
                  </ProtectedRoute>
                } />
                <Route path="/profil/add" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <ProfilAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/profil/edit/:ID_Profil" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <ProfilEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/karyawan" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <KaryawanPage />
                  </ProtectedRoute>
                } />
                <Route path="/karyawan/add" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <KaryawanAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/karyawan/edit/:ID_Karyawan" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <KaryawanEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/jabatan" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <JabatanPage />
                  </ProtectedRoute>
                } />
                <Route path="/jabatan/add" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <JabatanAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/jabatan/edit/:ID_Jabatan" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <JabatanEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/golongan" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <GolonganPage />
                  </ProtectedRoute>
                } />
                <Route path="/golongan/add" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <GolonganAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/golongan/edit/:ID_Golongan" element={
                  <ProtectedRoute requiredRoles={['admin', 'hr_staff', 'manager']}>
                    <GolonganEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/pendapatan" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PendapatanPage />
                  </ProtectedRoute>
                } />
                <Route path="/pendapatan/add" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PendapatanAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/pendapatan/edit/:ID_Pendapatan" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PendapatanEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/potongan" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PotonganPage />
                  </ProtectedRoute>
                } />
                <Route path="/potongan/add" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PotonganAddPage />
                  </ProtectedRoute>
                } />
                <Route path="/potongan/edit/:ID_Potongan" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PotonganEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/penggajian" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <PenggajianListPage />
                  </ProtectedRoute>
                } />
                <Route path="/penggajian/input" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff']}>
                    <PenggajianInputPage />
                  </ProtectedRoute>
                } />
                <Route path="/laporan" element={
                  <ProtectedRoute requiredRoles={['admin', 'finance', 'hr_staff', 'manager']}>
                    <LaporanGajiPage />
                  </ProtectedRoute>
                } />

              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
