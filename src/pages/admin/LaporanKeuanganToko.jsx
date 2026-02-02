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
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
  Divider
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Receipt,
  Payment,
  Calculate,
  Download,
  Print,
  Refresh,
  DateRange,
  AttachMoney,
  People,
  FlashOn,
  LocalShipping,
  Store,
  Inventory,
  BarChart,
  Visibility
} from "@mui/icons-material";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer, // PASTIKAN INI DIIMPOR
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'; // DARI SINI
import dayjs from "dayjs";
import api from "../../api";

export default function LaporanKeuangan() {
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState("bulan-ini");
  const [tanggalMulai, setTanggalMulai] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [tanggalSelesai, setTanggalSelesai] = useState(dayjs().format('YYYY-MM-DD'));
  const [laporanData, setLaporanData] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, type: '', data: [] });

  // Warna palette
  const BLACK = "#000000";
  const WHITE = "#ffffff";
  const GRAY_DARK = "#424242";
  const GRAY_MEDIUM = "#757575";
  const GRAY_LIGHT = "#bdbdbd";
  const PURPLE = "#9588e8";
  const GREEN = "#4caf50";
  const RED = "#f44336";
  const ORANGE = "#ff9800";
  const BLUE = "#2196f3";
  const TEAL = "#009688";

  // Data sample untuk chart
  const chartData = [
    { name: 'Sen', pendapatan: 4500000, hpp: 2800000, operasional: 1200000, laba: 500000 },
    { name: 'Sel', pendapatan: 5200000, hpp: 3200000, operasional: 1300000, laba: 700000 },
    { name: 'Rab', pendapatan: 4800000, hpp: 3000000, operasional: 1250000, laba: 550000 },
    { name: 'Kam', pendapatan: 6100000, hpp: 3800000, operasional: 1400000, laba: 900000 },
    { name: 'Jum', pendapatan: 5500000, hpp: 3400000, operasional: 1350000, laba: 750000 },
    { name: 'Sab', pendapatan: 7200000, hpp: 4500000, operasional: 1600000, laba: 1100000 },
    { name: 'Min', pendapatan: 6800000, hpp: 4200000, operasional: 1500000, laba: 1100000 },
  ];

  const dataPie = [
    { name: 'Gaji Karyawan', value: 4500000 },
    { name: 'Listrik & Air', value: 1200000 },
    { name: 'Sewa Tempat', value: 3000000 },
    { name: 'Transportasi', value: 800000 },
    { name: 'Lain-lain', value: 500000 },
  ];

  const COLORS = [PURPLE, GREEN, ORANGE, BLUE, TEAL];

  useEffect(() => {
    fetchLaporanData();
  }, [periode, tanggalMulai, tanggalSelesai]);

  const fetchLaporanData = async () => {
    setLoading(true);
    try {
      // Simulasi API call
      setTimeout(() => {
        const data = {
          ringkasan: {
            totalPendapatan: 39100000,
            totalHpp: 24900000,
            totalOperasional: 8600000,
            labaKotor: 14200000,
            labaBersih: 5600000,
            marginKotor: 36.3,
            marginBersih: 14.3
          },
          detailOperasional: [
            { kategori: 'Gaji Karyawan', jumlah: 4500000, persentase: 52.3 },
            { kategori: 'Listrik & Air', jumlah: 1200000, persentase: 14.0 },
            { kategori: 'Sewa Tempat', jumlah: 3000000, persentase: 34.9 },
            { kategori: 'Transportasi', jumlah: 800000, persentase: 9.3 },
            { kategori: 'Lain-lain', jumlah: 500000, persentase: 5.8 },
          ],
          trend: {
            pendapatanBulanLalu: 35200000,
            labaBulanLalu: 4800000,
            pertumbuhanPendapatan: 11.1,
            pertumbuhanLaba: 16.7
          }
        };
        setLaporanData(data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Gagal memuat data laporan:", error);
      setLoading(false);
    }
  };

  const handlePeriodeChange = (event) => {
    const value = event.target.value;
    setPeriode(value);
    
    const today = dayjs();
    switch (value) {
      case 'hari-ini':
        setTanggalMulai(today.format('YYYY-MM-DD'));
        setTanggalSelesai(today.format('YYYY-MM-DD'));
        break;
      case 'minggu-ini':
        setTanggalMulai(today.startOf('week').format('YYYY-MM-DD'));
        setTanggalSelesai(today.format('YYYY-MM-DD'));
        break;
      case 'bulan-ini':
        setTanggalMulai(today.startOf('month').format('YYYY-MM-DD'));
        setTanggalSelesai(today.format('YYYY-MM-DD'));
        break;
      case 'bulan-lalu':
        const lastMonth = today.subtract(1, 'month');
        setTanggalMulai(lastMonth.startOf('month').format('YYYY-MM-DD'));
        setTanggalSelesai(lastMonth.endOf('month').format('YYYY-MM-DD'));
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = (format) => {
    // Logic untuk export laporan
    console.log(`Exporting to ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const openDetailDialog = (type, data) => {
    setDetailDialog({ open: true, type, data });
  };

  const closeDetailDialog = () => {
    setDetailDialog({ open: false, type: '', data: [] });
  };

  // Komponen Ringkasan Keuangan
  const RingkasanKeuangan = ({ data }) => {
    if (!data) return null;

    return (
      <Grid container spacing={2}>
        {/* Total Pendapatan */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: `linear-gradient(135deg, ${WHITE} 0%, ${alpha(PURPLE, 0.05)} 100%)`,
            boxShadow: "0 4px 12px rgba(149, 136, 232, 0.15)",
            border: `1px solid ${alpha(PURPLE, 0.2)}`,
            height: '100%'
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Receipt sx={{ color: PURPLE, fontSize: 20 }} />
                <Typography variant="body2" fontWeight="600" color={GRAY_DARK}>
                  TOTAL PENDAPATAN
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="700" color={PURPLE} sx={{ mb: 1 }}>
                {formatCurrency(data.totalPendapatan)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 16, color: GREEN }} />
                <Typography variant="caption" color={GREEN} fontWeight="600">
                  +{data.trend?.pertumbuhanPendapatan || 0}% dari bulan lalu
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* HPP & Pengeluaran */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: `linear-gradient(135deg, ${WHITE} 0%, ${alpha(RED, 0.05)} 100%)`,
            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.15)",
            border: `1px solid ${alpha(RED, 0.2)}`,
            height: '100%'
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Payment sx={{ color: RED, fontSize: 20 }} />
                <Typography variant="body2" fontWeight="600" color={GRAY_DARK}>
                  HPP & PENGELUARAN
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="700" color={RED} sx={{ mb: 0.5 }}>
                {formatCurrency(data.totalHpp)}
              </Typography>
              <Typography variant="body2" color={GRAY_MEDIUM} sx={{ fontSize: '0.8rem' }}>
                HPP: {formatCurrency(data.totalHpp)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Laba Kotor */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: `linear-gradient(135deg, ${WHITE} 0%, ${alpha(GREEN, 0.05)} 100%)`,
            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)",
            border: `1px solid ${alpha(GREEN, 0.2)}`,
            height: '100%'
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp sx={{ color: GREEN, fontSize: 20 }} />
                <Typography variant="body2" fontWeight="600" color={GRAY_DARK}>
                  LABA KOTOR
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="700" color={GREEN} sx={{ mb: 1 }}>
                {formatCurrency(data.labaKotor)}
              </Typography>
              <Typography variant="caption" color={GRAY_MEDIUM} fontWeight="600">
                Margin: {data.marginKotor}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Laba Bersih */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: `linear-gradient(135deg, ${WHITE} 0%, ${alpha(BLUE, 0.05)} 100%)`,
            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.15)",
            border: `1px solid ${alpha(BLUE, 0.2)}`,
            height: '100%'
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccountBalance sx={{ color: BLUE, fontSize: 20 }} />
                <Typography variant="body2" fontWeight="600" color={GRAY_DARK}>
                  LABA BERSIH
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="700" color={BLUE} sx={{ mb: 1 }}>
                {formatCurrency(data.labaBersih)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 16, color: GREEN }} />
                <Typography variant="caption" color={GREEN} fontWeight="600">
                  +{data.trend?.pertumbuhanLaba || 0}% dari bulan lalu
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Komponen Perhitungan Laba Rugi
  const PerhitunganLabaRugi = ({ data }) => {
    if (!data) return null;

    return (
      <Card sx={{ 
        borderRadius: 2,
        background: WHITE,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        mb: 3
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="700" color={BLACK} sx={{ mb: 3 }}>
            📊 Perhitungan Laba Rugi
          </Typography>
          
          <Grid container spacing={3}>
            {/* Pendapatan */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                background: alpha(PURPLE, 0.05),
                border: `1px solid ${alpha(PURPLE, 0.2)}`
              }}>
                <Typography variant="subtitle1" fontWeight="600" color={PURPLE} sx={{ mb: 2 }}>
                  Pendapatan
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color={GRAY_DARK} sx={{ mb: 1 }}>
                    Total Penjualan:
                  </Typography>
                  <Typography variant="h6" fontWeight="700" color={PURPLE}>
                    {formatCurrency(data.totalPendapatan)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* HPP & Pengeluaran */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                background: alpha(RED, 0.05),
                border: `1px solid ${alpha(RED, 0.2)}`
              }}>
                <Typography variant="subtitle1" fontWeight="600" color={RED} sx={{ mb: 2 }}>
                  HPP & Pengeluaran
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color={GRAY_DARK}>
                    Harga Pokok Penjualan:
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color={RED}>
                    {formatCurrency(data.totalHpp)}
                  </Typography>
                </Box>

                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => openDetailDialog('hpp', data.detailOperasional)}
                  sx={{ mt: 1 }}
                >
                  Lihat Detail HPP
                </Button>
              </Box>
            </Grid>

            {/* Laba Kotor */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                background: alpha(GREEN, 0.05),
                border: `1px solid ${alpha(GREEN, 0.2)}`
              }}>
                <Typography variant="subtitle1" fontWeight="600" color={GREEN} sx={{ mb: 2 }}>
                  Laba Kotor
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color={GRAY_DARK}>
                    Pendapatan - HPP:
                  </Typography>
                  <Typography variant="h6" fontWeight="700" color={GREEN}>
                    {formatCurrency(data.labaKotor)}
                  </Typography>
                </Box>
                
                <Chip 
                  label={`Margin Kotor: ${data.marginKotor}%`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(GREEN, 0.1),
                    color: GREEN,
                    fontWeight: '600'
                  }}
                />
              </Box>
            </Grid>

            {/* Biaya Operasional */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                background: alpha(ORANGE, 0.05),
                border: `1px solid ${alpha(ORANGE, 0.2)}`
              }}>
                <Typography variant="subtitle1" fontWeight="600" color={ORANGE} sx={{ mb: 2 }}>
                  Biaya Operasional
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color={GRAY_DARK}>
                    Total Biaya:
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color={ORANGE}>
                    {formatCurrency(data.totalOperasional)}
                  </Typography>
                </Box>

                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => openDetailDialog('operasional', data.detailOperasional)}
                  sx={{ mt: 1 }}
                >
                  Lihat Detail Biaya
                </Button>
              </Box>
            </Grid>

            {/* Laba Bersih */}
            <Grid item xs={12}>
              <Box sx={{ 
                p: 3, 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(BLUE, 0.1)} 0%, ${alpha(GREEN, 0.1)} 100%)`,
                border: `2px solid ${alpha(BLUE, 0.3)}`,
                textAlign: 'center'
              }}>
                <Typography variant="h5" fontWeight="700" color={BLUE} sx={{ mb: 1 }}>
                  🎯 Laba Bersih
                </Typography>
                <Typography variant="h4" fontWeight="800" color={data.labaBersih >= 0 ? GREEN : RED} sx={{ mb: 2 }}>
                  {formatCurrency(data.labaBersih)}
                </Typography>
                <Chip 
                  label={`Margin Bersih: ${data.marginBersih}%`}
                  sx={{
                    backgroundColor: data.labaBersih >= 0 ? alpha(GREEN, 0.2) : alpha(RED, 0.2),
                    color: data.labaBersih >= 0 ? GREEN : RED,
                    fontWeight: '700',
                    fontSize: '1rem',
                    padding: '8px 16px'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Komponen Grafik Performa - DIPERBAIKI
  const GrafikPerforma = () => (
    <Card sx={{ 
      borderRadius: 2,
      background: WHITE,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
      mb: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="700" color={BLACK} sx={{ mb: 3 }}>
          📈 Grafik Performa Keuangan
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(GRAY_LIGHT, 0.5)} />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `Rp${value/1000000}Jt`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="pendapatan" name="Pendapatan" fill={PURPLE} />
                  <Bar dataKey="hpp" name="HPP" fill={RED} />
                  <Bar dataKey="operasional" name="Operasional" fill={ORANGE} />
                  <Bar dataKey="laba" name="Laba" fill={GREEN} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Jumlah']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Komponen Detail Biaya Operasional
  const DetailBiayaDialog = () => (
    <Dialog 
      open={detailDialog.open} 
      onClose={closeDetailDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="700">
          {detailDialog.type === 'operasional' ? 'Detail Biaya Operasional' : 'Detail HPP'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Kategori</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Jumlah</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Persentase</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailDialog.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {detailDialog.type === 'operasional' ? (
                        <>
                          {item.kategori === 'Gaji Karyawan' && <People sx={{ color: PURPLE }} />}
                          {item.kategori === 'Listrik & Air' && <FlashOn sx={{ color: ORANGE }} />}
                          {item.kategori === 'Sewa Tempat' && <Store sx={{ color: BLUE }} />}
                          {item.kategori === 'Transportasi' && <LocalShipping sx={{ color: GREEN }} />}
                          {item.kategori === 'Lain-lain' && <Inventory sx={{ color: TEAL }} />}
                        </>
                      ) : (
                        <AttachMoney sx={{ color: RED }} />
                      )}
                      {item.kategori}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: '600' }}>
                    {formatCurrency(item.jumlah)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${item.persentase}%`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(BLUE, 0.1),
                        color: BLUE,
                        fontWeight: '600'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDetailDialog}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color={BLACK} sx={{ mb: 1 }}>
            📊 Laporan Keuangan
          </Typography>
          <Typography variant="body1" color={GRAY_MEDIUM}>
            Analisis lengkap performa keuangan toko cabang
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Download />}
            variant="outlined"
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
          <Button
            startIcon={<Print />}
            variant="outlined"
            onClick={handlePrint}
          >
            Print
          </Button>
          <IconButton onClick={fetchLaporanData}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Periode</InputLabel>
              <Select
                value={periode}
                label="Periode"
                onChange={handlePeriodeChange}
                startAdornment={<DateRange sx={{ color: GRAY_MEDIUM, mr: 1 }} />}
              >
                <MenuItem value="hari-ini">Hari Ini</MenuItem>
                <MenuItem value="minggu-ini">Minggu Ini</MenuItem>
                <MenuItem value="bulan-ini">Bulan Ini</MenuItem>
                <MenuItem value="bulan-lalu">Bulan Lalu</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {periode === 'custom' && (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Tanggal Mulai"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Tanggal Selesai"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} md={periode === 'custom' ? 3 : 9}>
            <Chip 
              label={`Periode: ${dayjs(tanggalMulai).format('DD MMM YYYY')} - ${dayjs(tanggalSelesai).format('DD MMM YYYY')}`}
              sx={{
                backgroundColor: alpha(PURPLE, 0.1),
                color: PURPLE,
                fontWeight: '600'
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Ringkasan Keuangan */}
      <RingkasanKeuangan data={laporanData?.ringkasan} />

      {/* Perhitungan Laba Rugi */}
      <PerhitunganLabaRugi data={laporanData?.ringkasan} />

      {/* Grafik Performa */}
      <GrafikPerforma />

      {/* Detail Dialog */}
      <DetailBiayaDialog />
    </Box>
  );
}