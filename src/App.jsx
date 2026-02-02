import { Routes, Route, Navigate } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts & Components
import SidebarLayout from "./layout/SidebarLayout";
import ProtectedRoute from "./components/roleRoute"; // validasi cookie -> api/auth/me
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/roleRoute";
import Unauthorized from "./pages/Unauthorized";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import AllNotifications from "./components/AllNotifications";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import BarangList from "./pages/admin/BarangList";
import Penjualan from "./pages/admin/Penjualan";
import Pelanggan from "./pages/admin/Pelanggan";
import Supplier from "./pages/admin/Supplier";
import AddPembelian from "./pages/admin/AddPembelian";
import DaftarPembelian from "./pages/admin/DaftarPembelian";

import AddKasir from "./pages/admin/AddKasir";
import AddToko from "./pages/adminperusahaan/AddToko";
import RegisterPerusahaan from "./pages/RegisterPerusahaan";
import DashboardAdminPerusahaan from "./pages/adminperusahaan/DashboardAdminPerusahaan";
import CompanyProfileForm from "./pages/adminperusahaan/CompanyProfileForm";
import AddAdmin from "./pages/adminperusahaan/AddAdmin";
import AddBarang from "./pages/adminperusahaan/AddBarang";
import StokToko from "./pages/admin/StokToko";
import AddSatuan from "./pages/adminperusahaan/AddSatuan";
import AddKategori from "./pages/adminperusahaan/AddKategori";
import AddSupplier from "./pages/adminperusahaan/AddSupplier";
import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin";
import PerusahaanList from "./pages/superadmin/PerusahaanList";
import Users from "./pages/superadmin/Users"
import RiwayatPenjualan from "./pages/admin/RiwayatPenjualan";
import Laporan from "./pages/adminperusahaan/Laporan";
import TambahPembelian from "./pages/adminperusahaan/TambahPembelian";
import KeteranganPage from "./pages/adminperusahaan/keteranganPage";
import PetunjukPembayaran from "./pages/adminperusahaan/PetunjukPembayaran";
import VerifikasiEmail from "./pages/VerifikasiEmail";
import SubscriptionPlans from "./pages/superadmin/SubscriptionPlans";
import PembayaranList from "./pages/superadmin/PembayaranList";
import AddKelompok from "./pages/adminperusahaan/AddKelompok";
import AddKelompokKategoriSatuan from "./pages/adminperusahaan/AddKelompokKategoriSatuan";
import ResetPassword from "./components/ResetPassword";
import Transaksi from "./pages/kasir/Transaksi";
import RiwayatTransaksi from "./pages/kasir/RiwayatTransaksi";
import LaporanKeuanganToko from "./pages/admin/LaporanKeuanganToko";

// profile
import ProfilePage from "./pages/Profile/ProfilePage";

export default function App() {
  usePageTitle();

  return (
    <>
      <ToastContainer
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes> 
    

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-perusahaan" element={<RegisterPerusahaan />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/allnotifications" element={<AllNotifications />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        

        <Route path="/verifikasi-email" element={<VerifikasiEmail />} />

        {/* Protected with Sidebar */}
        <Route path="/" element={<SidebarLayout />}>
          <Route
            path="dashboard-admin"
            element={
              <RoleRoute allowedRoles={[1]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="barang"
            element={
              <RoleRoute allowedRoles={[1]}>
                <BarangList />
              </RoleRoute>
            }
          />
          <Route
            path="addpembelian"
            element={
              <RoleRoute allowedRoles={[1]}>
                <AddPembelian />
              </RoleRoute>
            }
          />
          <Route
            path="daftar-pembelian"
            element={
              <RoleRoute allowedRoles={[1]}>
                <DaftarPembelian />
              </RoleRoute>
            }
          />
          <Route
            path="penjualan"
            element={
              <RoleRoute allowedRoles={[1]}>
                <Penjualan />
              </RoleRoute>
            }
          />
          <Route
            path="riwayat-penjualan"
            element={
              <RoleRoute allowedRoles={[1]}>
                <RiwayatPenjualan />
              </RoleRoute>
            }
          />
          <Route
            path="addkasir"
            element={
              <RoleRoute allowedRoles={[1]}>
                <AddKasir />
              </RoleRoute>
            }
          />
          <Route
            path="supplier"
            element={
              <RoleRoute allowedRoles={[1]}>
                <Supplier />
              </RoleRoute>
            }
          /><Route
            path="laporan-keuangan-toko"
            element={
              <RoleRoute allowedRoles={[1]}>
                <LaporanKeuanganToko />
              </RoleRoute>
            }
          />
          <Route
            path="stoktoko"
            element={
              <RoleRoute allowedRoles={[1]}>
                <StokToko />
              </RoleRoute>
            }
          />
        </Route>

        {/* Other protected pages */}
        <Route
          path="/pelanggan"
          element={
            <RoleRoute allowedRoles={[1, 2]}>
              <Pelanggan />
            </RoleRoute>
          }
        />
        <Route path="/" element={<SidebarLayout />}>
          <Route
            path="/transaksi"
            element={
              <RoleRoute allowedRoles={[2]}>
                <Transaksi />
              </RoleRoute>
            }
          />
          <Route
            path="/riwayat_transaksi"
            element={
              <RoleRoute allowedRoles={[2]}>
                <RiwayatTransaksi />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="/" element={<SidebarLayout />}>
          <Route
            path="/dashboard-adminperusahaan"
            element={
              <RoleRoute allowedRoles={[3]}>
                <DashboardAdminPerusahaan />
              </RoleRoute>
            }
          />
          <Route
            path="/addtoko"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddToko />
              </RoleRoute>
            }
          />
          <Route
            path="/company-profile"
            element={
              <RoleRoute allowedRoles={[3]}>
                <CompanyProfileForm />
              </RoleRoute>
            }
          />
          <Route
            path="/addadmin"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddAdmin />
              </RoleRoute>
            }
          />
          <Route
            path="/addbarang"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddBarang />
              </RoleRoute>
            }
          />
          <Route
            path="/addsupplier"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddSupplier />
              </RoleRoute>
            }
          />
          <Route
            path="/addkategori"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddKategori />
              </RoleRoute>
            }
          />
          <Route
            path="/addsatuan"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddSatuan />
              </RoleRoute>
            }
          />
          <Route
            path="/laporan"
            element={
              <RoleRoute allowedRoles={[3]}>
                <Laporan />
              </RoleRoute>
            }
          /> 
          <Route
            path="/keterangan"
            element={
              <RoleRoute allowedRoles={[3]}>
                <KeteranganPage />
              </RoleRoute>
            }
          />
          <Route
            path="/tambahpembelian"
            element={
              <RoleRoute allowedRoles={[3]}>
                <TambahPembelian />
              </RoleRoute>
            }
          />
          <Route
            path="/petunjuk-pembayaran"
            element={
              <RoleRoute allowedRoles={[3]}>
                <PetunjukPembayaran />
              </RoleRoute>
            }
          />
          <Route
            path="/addkelompok"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddKelompok />
              </RoleRoute>
            }
          />
          <Route
            path="/addkks"
            element={
              <RoleRoute allowedRoles={[3]}>
                <AddKelompokKategoriSatuan />
              </RoleRoute>
            }
          />
        </Route> 
        <Route path="/" element={<SidebarLayout />}>
          <Route
            path="/dashboardsuperadmin"
            element={
              <RoleRoute allowedRoles={[0]}>
                <DashboardSuperAdmin />
              </RoleRoute>
            }
          />
          <Route
            path="/perusahaan-list"
            element={
              <RoleRoute allowedRoles={[0]}>
                <PerusahaanList />
              </RoleRoute>
            }
          />
          <Route
            path="/users"
            element={
              <RoleRoute allowedRoles={[0]}>
                <Users />
              </RoleRoute>
            }
          />
          <Route
            path="/subscription-plans"
            element={
              <RoleRoute allowedRoles={[0]}>
                <SubscriptionPlans />
              </RoleRoute>
            }
          />
          <Route
            path="/pembayaran-list"
            element={
              <RoleRoute allowedRoles={[0]}>
                <PembayaranList />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}