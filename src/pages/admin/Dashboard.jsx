import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  alpha,
  IconButton,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  Store,
  Assessment,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  LocalFireDepartment,
  Notifications,
  AccountBalance,
  Warning,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    barang: 0,
    stok: 0,
    pembelian: 0,
    penjualan: 0,
    kasir: 0,
    kategori: 0
  });

  const [todayStats, setTodayStats] = useState({
    penjualanHariIni: 0,
    pembelianHariIni: 0,
    penjualanKemarin: 0,
    pembelianKemarin: 0,
    pertumbuhanPenjualan: 0,
    pertumbuhanPembelian: 0
  });

  const [pembelianData, setPembelianData] = useState([]);
  const [penjualanData, setPenjualanData] = useState([]);
  const [barangTerlaris, setBarangTerlaris] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [barangStokMenipis, setBarangStokMenipis] = useState([]);
  const [ringkasanKeuangan, setRingkasanKeuangan] = useState({
    pendapatan: 0,
    pengeluaran: 0,
    laba: 0
  });
  const [notifikasi, setNotifikasi] = useState([]);

  // Warna palette
  const BLACK = "#000000";
  const WHITE = "#ffffff";
  const GRAY_DARK = "#424242";
  const GRAY_MEDIUM = "#757575";
  const GRAY_LIGHT = "#bdbdbd";
  const PURPLE = "#9588e8";
  const PURPLE_LIGHT = alpha("#9588e8", 0.1);
  const GREEN = "#4caf50";
  const RED = "#f44336";
  const ORANGE = "#ff9800";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, 
        pembelianRes, 
        penjualanRes,
        todayStatsRes,
        barangTerlarisRes,
        chartDataRes,
        stokMenipisRes,
        keuanganRes
      ] = await Promise.all([
        api.get("/dashboard-stats"),
        api.get("/pembelian"),
        api.get("/penjualan/riwayat?limit=5"),
        api.get("/today-stats"),
        api.get("/barang-terlaris"),
        api.get("/chart-data"),
        api.get("/barang/barang-stok-menipis?batas=10&level=kritis"), // tambahkan parameter
        api.get("/ringkasan-keuangan")
      ]);
      
      if (statsRes.data) setStats(statsRes.data);
      if (pembelianRes.data) setPembelianData(pembelianRes.data.slice(0, 5));
      if (penjualanRes.data) {
        const data = Array.isArray(penjualanRes.data) ? penjualanRes.data : penjualanRes.data.data;
        setPenjualanData(data?.slice(0, 5) || []);
      }
      if (todayStatsRes.data) setTodayStats(todayStatsRes.data);
      if (barangTerlarisRes.data) setBarangTerlaris(barangTerlarisRes.data);
      if (chartDataRes.data) setChartData(chartDataRes.data);
      if (stokMenipisRes.data) {
        setBarangStokMenipis(stokMenipisRes.data || []);
        // Generate notifikasi setelah dapat data stok menipis
        generateNotifikasi(stokMenipisRes.data, todayStatsRes.data);
      }
      if (keuanganRes.data) setRingkasanKeuangan(keuanganRes.data);

    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
      generateFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const generateNotifikasi = (stokData, todayData) => {
    const notif = [];
    
    // Notifikasi stok menipis - dengan prioritas lebih tinggi
    if (stokData && stokData.data && stokData.data.length > 0) {
      stokData.data.forEach(item => {
        let pesan = '';
        let tipe = 'warning';
        
        if (item.status === 'Habis') {
          pesan = `Stok ${item.nama_barang} sudah habis`;
          tipe = 'error';
        } else if (item.status === 'Kritis') {
          pesan = `Stok ${item.nama_barang} kritis: ${item.stok} ${item.satuan} tersisa`;
          tipe = 'error';
        } else {
          pesan = `Stok ${item.nama_barang} menipis: ${item.stok} ${item.satuan} tersisa`;
          tipe = 'warning';
        }

        notif.push({
          id: `stok-${item.id_barang}`,
          judul: `Peringatan Stok ${item.status}`,
          pesan: pesan,
          waktu: "Baru saja",
          tipe: tipe,
          icon: <Warning />
        });
      });
    }

    // Notifikasi pertumbuhan penjualan
    if (todayData && todayData.pertumbuhanPenjualan > 0) {
      notif.push({
        id: 'penjualan-naik',
        judul: "Penjualan meningkat",
        pesan: `Penjualan meningkat ${todayData.pertumbuhanPenjualan.toFixed(1)}% dari kemarin`,
        waktu: "Hari ini",
        tipe: "success",
        icon: <ArrowUpward />
      });
    } else if (todayData && todayData.pertumbuhanPenjualan < 0) {
      notif.push({
        id: 'penjualan-turun',
        judul: "Penjualan menurun",
        pesan: `Penjualan menurun ${Math.abs(todayData.pertumbuhanPenjualan).toFixed(1)}% dari kemarin`,
        waktu: "Hari ini",
        tipe: "error",
        icon: <ArrowDownward />
      });
    }

    // Notifikasi pembelian baru
    if (pembelianData.length > 0) {
      notif.push({
        id: 'pembelian-baru',
        judul: "Pembelian baru",
        pesan: `${pembelianData.length} transaksi pembelian hari ini`,
        waktu: "Baru saja",
        tipe: "info",
        icon: <ShoppingCart />
      });
    }

    // Urutkan notifikasi: error dulu, kemudian warning, kemudian info/success
    notif.sort((a, b) => {
      const priority = { error: 0, warning: 1, info: 2, success: 3 };
      return priority[a.tipe] - priority[b.tipe];
    });

    setNotifikasi(notif.slice(0, 5)); // Batasi maksimal 5 notifikasi
  };

  const generateFallbackData = () => {
    const fallbackChartData = [
      { name: 'Sen', penjualan: 0, pembelian: 0 },
      { name: 'Sel', penjualan: 0, pembelian: 0 },
      { name: 'Rab', penjualan: 0, pembelian: 0 },
      { name: 'Kam', penjualan: 0, pembelian: 0 },
      { name: 'Jum', penjualan: 0, pembelian: 0 },
      { name: 'Sab', penjualan: 0, pembelian: 0 },
      { name: 'Min', penjualan: 0, pembelian: 0 },
    ];
    setChartData(fallbackChartData);
    setBarangTerlaris([]);
    setBarangStokMenipis([]);
    setNotifikasi([]);
  };

  const getTrendIcon = (value) => {
    return value >= 0 ? 
      <ArrowUpward sx={{ fontSize: 14, color: GREEN }} /> : 
      <ArrowDownward sx={{ fontSize: 14, color: RED }} />;
  };

  const getTrendColor = (value) => {
    return value >= 0 ? GREEN : RED;
  };

  const formatGrowthText = (value) => {
    if (value === 0) return "0%";
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  const statCards = [
    { 
      label: "Total Barang", 
      value: stats.barang, 
      icon: <Inventory />,
      color: BLACK,
    },
    { 
      label: "Total Stok", 
      value: stats.stok, 
      icon: <Store />,
      color: GRAY_DARK,
    },
    { 
      label: "Penjualan Hari Ini", 
      value: todayStats.penjualanHariIni, 
      icon: <Assessment />,
      color: PURPLE,
      prefix: "Rp ",
      growth: todayStats.pertumbuhanPenjualan
    },
    { 
      label: "Pembelian Hari Ini", 
      value: todayStats.pembelianHariIni, 
      icon: <ShoppingCart />,
      color: GRAY_MEDIUM,
      prefix: "Rp ",
      growth: todayStats.pertumbuhanPembelian
    },
  ];

  const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Komponen Tabel untuk Pembelian dan Penjualan
  const DataTable = ({ data, title, type }) => {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          background: WHITE,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
          overflow: "hidden",
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box 
          sx={{ 
            p: 2,
            borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
            background: WHITE,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="600" color={BLACK}>
              {title}
            </Typography>
            <Chip 
              label={`${data.length} transaksi`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: alpha(GRAY_MEDIUM, 0.3),
                color: GRAY_MEDIUM,
                fontWeight: 500,
                fontSize: '0.7rem'
              }}
            />
          </Box>
        </Box>
        
        <TableContainer sx={{ flex: 1 }}>
          <Table size="small" sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(GRAY_LIGHT, 0.1) }}>
                <TableCell sx={{ fontWeight: '600', color: BLACK, fontSize: '0.8rem', py: 1.5, px: 2 }}>
                  {type === 'penjualan' ? 'No Faktur' : 'Supplier'}
                </TableCell>
                <TableCell sx={{ fontWeight: '600', color: BLACK, fontSize: '0.8rem', py: 1.5, px: 2 }}>
                  Tanggal
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: '600', color: BLACK, fontSize: '0.8rem', py: 1.5, px: 2 }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id_penjualan || item.id_beli}
                  sx={{
                    '&:last-child td': { borderBottom: 'none' },
                    '&:hover': {
                      backgroundColor: alpha(PURPLE, 0.02),
                    },
                  }}
                >
                  <TableCell sx={{ py: 1.5, px: 2 }}>
                    <Typography variant="body2" fontWeight="500" color={BLACK} sx={{ fontSize: '0.8rem' }}>
                      {type === 'penjualan' ? (item.no_faktur || '-') : (item.nama_supplier || '-')}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, px: 2 }}>
                    <Typography variant="body2" fontWeight="500" color={BLACK} sx={{ fontSize: '0.8rem' }}>
                      {dayjs(item.tgl_jual || item.tgl_beli).format("DD/MM")}
                    </Typography>
                    <Typography variant="caption" color={GRAY_MEDIUM} sx={{ fontSize: '0.7rem' }}>
                      {dayjs(item.created_at).format("HH:mm")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5, px: 2 }}>
                    <Typography variant="body2" fontWeight="600" color={BLACK} sx={{ fontSize: '0.8rem' }}>
                      {formatCurrency(item.total)}
                    </Typography>
                    <Chip 
                      label={type === 'penjualan' ? 'Jual' : 'Beli'} 
                      size="small" 
                      sx={{
                        backgroundColor: type === 'penjualan' ? PURPLE_LIGHT : alpha(GRAY_MEDIUM, 0.1),
                        color: type === 'penjualan' ? PURPLE : GRAY_MEDIUM,
                        fontWeight: 500,
                        fontSize: '0.6rem',
                        height: 18,
                        mt: 0.5
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {data.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color={GRAY_MEDIUM}>
              Belum ada data {type === 'penjualan' ? 'penjualan' : 'pembelian'}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  // Komponen Barang Terlaris
  const BarangTerlaris = ({ data }) => {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          background: WHITE,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
          overflow: "hidden",
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box 
          sx={{ 
            p: 2,
            borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
            background: WHITE,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalFireDepartment sx={{ color: PURPLE, fontSize: 20 }} />
            <Typography variant="h6" fontWeight="600" color={BLACK}>
              Barang Terlaris
            </Typography>
          </Box>
        </Box>
        
        <TableContainer sx={{ flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(GRAY_LIGHT, 0.1) }}>
                <TableCell sx={{ fontWeight: '600', color: BLACK, fontSize: '0.8rem', py: 1.5, px: 2 }}>
                  Barang
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: '600', color: BLACK, fontSize: '0.8rem', py: 1.5, px: 2, width: 100 }}>
                  Terjual
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: '600', color: BLACK, fontSize: '0.8rem', py: 1.5, px: 2, width: 120 }}>
                  Pendapatan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id_barang}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(PURPLE, 0.02),
                    }
                  }}
                >
                  <TableCell sx={{ py: 1.5, px: 2 }}>
                    <Box>
                      <Typography variant="body2" fontWeight="600" color={BLACK} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                        {item.nama_barang}
                      </Typography>
                      <Typography variant="caption" color={GRAY_MEDIUM} sx={{ fontSize: '0.7rem' }}>
                        {item.barcode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1.5, px: 2 }}>
                    <Chip 
                      label={`${formatNumber(item.total_terjual)} pcs`}
                      size="small"
                      sx={{
                        backgroundColor: PURPLE_LIGHT,
                        color: PURPLE,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5, px: 2 }}>
                    <Typography variant="body2" fontWeight="600" color={BLACK} sx={{ fontSize: '0.8rem' }}>
                      {formatCurrency(item.total_pendapatan)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {data.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color={GRAY_MEDIUM}>
              Belum ada data barang terlaris
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  // Komponen Ringkasan Keuangan
  const RingkasanKeuangan = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'details', 'chart'

  // Hitung persentase
  const marginPercentage = data.pendapatan > 0 ? (data.laba / data.pendapatan) * 100 : 0;
  const pengeluaranPercentage = data.pendapatan > 0 ? (data.pengeluaran / data.pendapatan) * 100 : 0;

  // Data untuk mini chart
  const chartData = [
    { name: 'Pendapatan', value: data.pendapatan, color: PURPLE },
    { name: 'Pengeluaran', value: data.pengeluaran, color: GRAY_MEDIUM },
    { name: 'Laba', value: Math.max(data.laba, 0), color: data.laba >= 0 ? GREEN : RED }
  ];

  return (
    <Paper
      elevation={isHovered ? 4 : 0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${WHITE} 0%, ${alpha(PURPLE, 0.02)} 100%)`,
        boxShadow: isHovered 
          ? "0 8px 32px rgba(149, 136, 232, 0.15)" 
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${alpha(PURPLE, isHovered ? 0.3 : 0.1)}`,
        overflow: "hidden",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${PURPLE} 0%, ${data.laba >= 0 ? GREEN : RED} 100%)`,
          opacity: isHovered ? 1 : 0.7,
        }
      }}
    >
      {/* Header dengan Tab Navigation */}
      <Box 
        sx={{ 
          p: 2,
          borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`,
          background: 'transparent',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalance sx={{ 
              color: PURPLE, 
              fontSize: 24,
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }} />
            <Typography variant="h6" fontWeight="700" color={BLACK}>
              Ringkasan Keuangan
            </Typography>
          </Box>
          
          {/* Tab Indicators */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {['overview', 'details', 'chart'].map((view) => (
              <Box
                key={view}
                onClick={() => setCurrentView(view)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: currentView === view ? PURPLE : alpha(GRAY_LIGHT, 0.5),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: currentView === view ? PURPLE : alpha(GRAY_MEDIUM, 0.7),
                    transform: 'scale(1.2)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Period Selector */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label="Bulan Ini" 
            size="small"
            variant="outlined"
            sx={{
              borderColor: alpha(PURPLE, 0.3),
              color: PURPLE,
              fontWeight: '600',
              fontSize: '0.7rem',
              background: alpha(PURPLE, 0.05)
            }}
          />
          <Typography variant="caption" color={GRAY_MEDIUM}>
            {dayjs().format('MMM YYYY')}
          </Typography>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {currentView === 'overview' && (
          <>
            {/* Main Metrics */}
            <Box>
              {/* Pendapatan dengan trend indicator */}
              <Box sx={{ mb: 3, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" color={GRAY_MEDIUM} sx={{ fontSize: '0.75rem', fontWeight: '500' }}>
                    PENDAPATAN
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    backgroundColor: alpha(GREEN, 0.1),
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    <ArrowUpward sx={{ fontSize: 14, color: GREEN }} />
                    <Typography variant="caption" fontWeight="600" color={GREEN}>
                      +12.5%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="800" color={PURPLE} sx={{ fontSize: '1.5rem' }}>
                  {formatCurrency(data.pendapatan)}
                </Typography>
              </Box>

              {/* Pengeluaran */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color={GRAY_MEDIUM} sx={{ fontSize: '0.75rem', fontWeight: '500', mb: 1 }}>
                  PENGELUARAN
                </Typography>
                <Typography variant="h5" fontWeight="700" color={GRAY_DARK}>
                  {formatCurrency(data.pengeluaran)}
                </Typography>
                <Typography variant="caption" color={GRAY_MEDIUM}>
                  {pengeluaranPercentage.toFixed(1)}% dari pendapatan
                </Typography>
              </Box>

              {/* Laba Bersih dengan Highlight */}
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(data.laba >= 0 ? GREEN : RED, 0.1)} 0%, ${alpha(data.laba >= 0 ? GREEN : RED, 0.05)} 100%)`,
                border: `1px solid ${alpha(data.laba >= 0 ? GREEN : RED, 0.2)}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color={GRAY_MEDIUM} sx={{ fontSize: '0.75rem', fontWeight: '500', mb: 0.5 }}>
                      LABA KOTOR
                    </Typography>
                    <Typography 
                      variant="h4" 
                      fontWeight="800" 
                      sx={{ 
                        color: data.laba >= 0 ? GREEN : RED,
                        fontSize: '1.4rem'
                      }}
                    >
                      {formatCurrency(data.laba)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: data.laba >= 0 ? GREEN : RED,
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      {data.laba >= 0 ? '📈' : '📉'} 
                      {data.laba >= 0 ? `Profit (${marginPercentage.toFixed(1)}%)` : `Rugi (${Math.abs(marginPercentage).toFixed(1)}%)`}
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${data.laba >= 0 ? GREEN : RED} 0%, ${alpha(data.laba >= 0 ? GREEN : RED, 0.7)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: WHITE,
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    {data.laba >= 0 ? '↑' : '↓'}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              pt: 2,
              borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color={GRAY_MEDIUM} sx={{ display: 'block' }}>
                  Margin
                </Typography>
                <Typography variant="body2" fontWeight="700" color={PURPLE}>
                  {marginPercentage.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color={GRAY_MEDIUM} sx={{ display: 'block' }}>
                  ROI
                </Typography>
                <Typography variant="body2" fontWeight="700" color={GREEN}>
                  {(data.pengeluaran > 0 ? (data.laba / data.pengeluaran) * 100 : 0).toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color={GRAY_MEDIUM} sx={{ display: 'block' }}>
                  Status
                </Typography>
                <Typography variant="body2" fontWeight="700" color={data.laba >= 0 ? GREEN : RED}>
                  {data.laba >= 0 ? 'Healthy' : 'Alert'}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {currentView === 'details' && (
          <Box>
            <Typography variant="body2" fontWeight="600" color={BLACK} sx={{ mb: 2 }}>
              Detail Keuangan
            </Typography>
            {/* Add detailed breakdown here */}
          </Box>
        )}

        {currentView === 'chart' && (
          <Box>
            <Typography variant="body2" fontWeight="600" color={BLACK} sx={{ mb: 2 }}>
              Visualisasi
            </Typography>
            {/* Add mini chart here */}
          </Box>
        )}

        {/* Progress Bar untuk Rasio Keuangan */}
        {/* <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color={GRAY_MEDIUM}>
              Rasio Keuangan
            </Typography>
            <Typography variant="caption" fontWeight="600" color={marginPercentage >= 20 ? GREEN : ORANGE}>
              {marginPercentage >= 20 ? 'Excellent' : 'Good'}
            </Typography>
          </Box>
          <Box sx={{ 
            width: '100%', 
            height: 6, 
            backgroundColor: alpha(GRAY_LIGHT, 0.3), 
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: `${Math.min(marginPercentage, 100)}%`, 
              height: '100%',
              background: `linear-gradient(90deg, ${PURPLE} 0%, ${data.laba >= 0 ? GREEN : RED} 100%)`,
              borderRadius: 3,
              transition: 'width 0.5s ease-in-out'
            }} />
          </Box>
        </Box> */}
      </Box>

      {/* Footer dengan Action Buttons */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`,
        display: 'flex',
        gap: 1,
        justifyContent: 'space-between'
      }}>
        <IconButton size="small" sx={{ color: PURPLE }}>
          <Refresh fontSize="small" />
        </IconButton>
        <Chip 
          label="Lihat Laporan" 
          size="small"
          clickable
          onClick={() => navigate('/laporan-keuangan-toko')}
          sx={{
            backgroundColor: alpha(PURPLE, 0.1),
            color: PURPLE,
            fontWeight: '600',
            fontSize: '0.7rem',
            '&:hover': {
              backgroundColor: alpha(PURPLE, 0.2),
            },
            cursor: 'pointer'
          }}
        />
      </Box>
    </Paper>
  );
};

  // Komponen Notifikasi Terbaru
  const NotifikasiTerbaru = ({ items }) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        background: WHITE,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        overflow: "hidden",
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        sx={{ 
          p: 2,
          borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
          background: WHITE,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications sx={{ color: PURPLE, fontSize: 20 }} />
          <Typography variant="h6" fontWeight="600" color={BLACK}>
            Notifikasi Terbaru
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ p: 2, flex: 1 }}>
        {items.length > 0 ? (
          items.slice(0, 5).map((notif) => (
            <Alert
              key={notif.id}
              severity={notif.tipe}
              icon={notif.icon}
              sx={{ 
                mb: 1.5,
                '& .MuiAlert-message': { 
                  padding: '4px 0',
                  width: '100%'
                }
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.8rem' }}>
                  {notif.judul}
                </Typography>
                <Typography variant="caption" color={GRAY_MEDIUM} sx={{ fontSize: '0.7rem' }}>
                  {notif.pesan}
                </Typography>
                <Typography variant="caption" color={GRAY_MEDIUM} sx={{ fontSize: '0.6rem', display: 'block', mt: 0.5 }}>
                  {notif.waktu}
                </Typography>
              </Box>
            </Alert>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Notifications sx={{ fontSize: 40, color: GRAY_LIGHT, mb: 1 }} />
            <Typography variant="body2" color={GRAY_MEDIUM}>
              Tidak ada notifikasi baru
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );

  // Komponen Chart Area Interaktif
  const ChartAreaInteractive = () => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 2,
        background: WHITE,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box 
          sx={{ 
            p: 2,
            borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
          }}
        >
          <Typography variant="h6" fontWeight="600" color={BLACK}>
            Grafik Transaksi 7 Hari Terakhir
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, height: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPembelian" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GRAY_MEDIUM} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={GRAY_MEDIUM} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(GRAY_LIGHT, 0.5)} />
                <XAxis 
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke={GRAY_DARK}
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `Rp${(value/1000000).toFixed(0)}Jt`;
                    if (value >= 1000) return `Rp${(value/1000).toFixed(0)}Rb`;
                    return `Rp${value}`;
                  }}
                  stroke={GRAY_DARK}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `Hari: ${label}`}
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                    backgroundColor: WHITE,
                    color: BLACK,
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="pembelian" 
                  stroke={GRAY_MEDIUM}
                  fill="url(#colorPembelian)"
                  name="Pembelian"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="penjualan" 
                  stroke={PURPLE}
                  fill="url(#colorPenjualan)"
                  name="Penjualan"
                  strokeWidth={2}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color={GRAY_MEDIUM}>
                Belum ada data transaksi
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2, background: WHITE, minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            variant="h5" 
            fontWeight="700"
            sx={{
              color: BLACK,
              mb: 0.5,
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color={GRAY_MEDIUM}>
            Ringkasan performa toko - {dayjs().format('DD MMMM YYYY')}
          </Typography>
        </Box>
        
        <IconButton
          onClick={fetchDashboardData}
          disabled={loading}
          size="small"
          sx={{
            backgroundColor: WHITE,
            color: PURPLE,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${alpha(PURPLE, 0.2)}`,
            '&:hover': {
              backgroundColor: PURPLE,
              color: WHITE,
            },
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* Key Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card 
              sx={{
                borderRadius: 2,
                background: WHITE,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box 
                    sx={{ 
                      backgroundColor: card.color === PURPLE ? PURPLE_LIGHT : alpha(card.color, 0.1),
                      borderRadius: '10px',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ color: card.color, fontSize: '1.2rem' }}>
                      {card.icon}
                    </Box>
                  </Box>
                  
                  {card.growth !== undefined && (
                    <Chip 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          {getTrendIcon(card.growth)}
                          <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.7rem' }}>
                            {formatGrowthText(card.growth)}
                          </Typography>
                        </Box>
                      }
                      size="small" 
                      sx={{ 
                        backgroundColor: card.growth >= 0 ? alpha(GREEN, 0.1) : alpha(RED, 0.1),
                        color: getTrendColor(card.growth),
                        fontWeight: '600',
                        height: 20
                      }} 
                    />
                  )}
                </Box>
                
                <Typography variant="h5" fontWeight="700" sx={{ color: card.color, mb: 0.5, fontSize: '1.4rem' }}>
                  {card.prefix ? formatCurrency(card.value) : formatNumber(card.value)}
                </Typography>
                
                <Typography variant="body2" color={GRAY_MEDIUM} sx={{ fontWeight: '500', fontSize: '0.8rem' }}>
                  {card.label}
                </Typography>

                {card.growth !== undefined && card.growth !== 0 && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: getTrendColor(card.growth),
                      fontWeight: '600',
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    {card.growth >= 0 ? 'Meningkat' : 'Menurun'} dari kemarin
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mb: 3 }}>
        <ChartAreaInteractive />
      </Box>

      {/* Bottom Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Baris 1: Barang Terlaris, Ringkasan Keuangan, dan Notifikasi */}
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Barang Terlaris */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px'
          }}>
            <BarangTerlaris data={barangTerlaris} />
          </div>

          {/* Ringkasan Keuangan */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px'
          }}>
            <RingkasanKeuangan data={ringkasanKeuangan} />
          </div>

          {/* Notifikasi Terbaru */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px'
          }}>
            <NotifikasiTerbaru items={notifikasi} />
          </div>
        </div>

        {/* Baris 2: Pembelian Terbaru dan Penjualan Terbaru */}
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Pembelian Terbaru */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px'
          }}>
            <DataTable 
              data={pembelianData} 
              title="Pembelian Terbaru" 
              type="pembelian" 
            />
          </div>

          {/* Penjualan Terbaru */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px'
          }}>
            <DataTable 
              data={penjualanData} 
              title="Penjualan Terbaru" 
              type="penjualan" 
            />
          </div>
        </div>
      </div>
    </Box>
  );
}