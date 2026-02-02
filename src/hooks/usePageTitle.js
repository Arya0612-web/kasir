import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const titles = {
  "/login": "Login  ",
  "/dashboard-admin": "Dashboard Admin | Toko",
  "/barang": "Barang | Toko",
  "/dashboard-kasir": "Dashboard Kasir | Kasir",
  "/dashboard-adminperusahaan": "Dashboard Admin | Perusahaan",
  "/dashboardsuperadmin": "Dashboard | SuperAdmin",
  "/addtoko": "Tambah Toko | Perusahaan",
  "/addadmin": "Tambah Admin | Perusahaan",
  "/addpembelian": "Tambah Pembelian | Toko",
  "/daftar-pembelian": "Daftar Pembelian | Toko",
  "/addkasir": "Tambah Kasir | Toko",
  "/addbarang": "Tambah Barang | Perusahaan",
  "/addkategori": "Tambah Kategori | Perusahaan",
  "/addsupplier": "Tambah Supplier | Perusahaan",
  "/addsatuan": "Tambah Satuan | Perusahaan",
  "/stoktoko": "Tambah Stok | Toko",
  "/penjualan": "Penjualan | Toko",
  "/riwayat-penjualan": "Daftar Penjualan | Toko",
  "/pembelian": "Pembelian | Toko",
  "/pelanggan": "Pelanggan | Toko",
  "/supplier": "Supplier | Perusahaan",
  "/company-profile": "Profile | Perusahaan",
  "/register-perusahaan": "Register | Perusahaan",
  "/laporan": "Laporan | Perusahaan",
  "/keterangan": "Keterangan | Perusahaan",
  "/tambahpembelian": "Tambah Pembelian | Perusahaan",
  "/perusahaan-list": "Daftar Perusahaan | SuperAdmin",
  "/users" : "Daftar Users | SuperAdmin",
  "/transaksi" : "Transaksi | Kasir",
  "/addkks": "Manajemen | Perusahaan",
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = titles[location.pathname] || "Kasir";
    document.title = title;
  }, [location]);
}
