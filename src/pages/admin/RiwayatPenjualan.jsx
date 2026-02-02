import { useEffect, useState } from "react";
import api from "../../api";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  TextField,
  Button,
  Stack,
  TablePagination,
  Card,
  CardContent,
  Grid,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Search,
  FilterList,
  PictureAsPdf,
  Visibility,
  Download,
  Close,
  Receipt,
  CalendarToday,
  Person,
  PointOfSale,
  MoreVert,
  Edit,
  ContentCopy,
  Delete,
  Print,
  AttachMoney
} from "@mui/icons-material";

// Warna palette hitam putih
const BLACK = "#000000";
const WHITE = "#ffffff";
const GRAY_DARK = "#2c2c2c";
const GRAY_MEDIUM = "#5a5a5a";
const GRAY_LIGHT = "#616161";
const GRAY_BACKGROUND = "#f8f9fa";
const SUCCESS_COLOR = "#4caf50";
const ERROR_COLOR = "#f44336";

function formatCurrency(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(num || 0));
}

export default function RiwayatPenjualan() {
  const [allRiwayat, setAllRiwayat] = useState([]); // Semua data dari API
  const [filteredRiwayat, setFilteredRiwayat] = useState([]); // Data yang sudah difilter
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedStruk, setSelectedStruk] = useState(null);
  const [strukLoading, setStrukLoading] = useState(false);

  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPenjualan, setSelectedPenjualan] = useState(null);

  // Fetch semua data saat komponen mount
  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const res = await api.get("/penjualan/riwayat");

      if (Array.isArray(res.data)) {
        setAllRiwayat(res.data);
      } else {
        const rows = res.data.data || res.data.rows || [];
        setAllRiwayat(rows);
      }
    } catch (err) {
      console.error("Gagal ambil riwayat:", err);
      setAllRiwayat([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // Filter data secara client-side berdasarkan search term dan tanggal
  useEffect(() => {
    const filteredData = allRiwayat.filter(item => {
      // Filter berdasarkan search term
      const matchesSearch = !searchTerm || 
        item.no_faktur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_user?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter berdasarkan tanggal
      const itemDate = new Date(item.created_at || item.tgl_jual);
      const startDateObj = start ? new Date(start) : null;
      const endDateObj = end ? new Date(end) : null;
      
      const matchesStartDate = !startDateObj || itemDate >= new Date(startDateObj.setHours(0, 0, 0, 0));
      const matchesEndDate = !endDateObj || itemDate <= new Date(endDateObj.setHours(23, 59, 59, 999));

      return matchesSearch && matchesStartDate && matchesEndDate;
    });

    setFilteredRiwayat(filteredData);
    setPage(0); // Reset ke halaman pertama saat filter berubah
  }, [allRiwayat, searchTerm, start, end]);

  const handleResetFilter = () => {
    setStart("");
    setEnd("");
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
  };

  const handlePreviewStruk = async (penjualan) => {
    setStrukLoading(true);
    setSelectedStruk(penjualan);
    setPreviewOpen(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setStrukLoading(false);
    }, 1000);
  };

  const handleDownloadStruk = async (id_penjualan, no_faktur) => {
    try {
      const res = await api.get(`/penjualan/${id_penjualan}/struk`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `struk-${no_faktur}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal download struk:", err);
    }
  };

  // Menu handlers
  const handleMenuOpen = (event, penjualan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPenjualan(penjualan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPenjualan(null);
  };

  const handleViewDetail = () => {
    if (selectedPenjualan) {
      // Navigate to detail page or show detail dialog
      console.log("Lihat detail penjualan:", selectedPenjualan);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedPenjualan) {
      // Navigate to edit page
      console.log("Edit penjualan:", selectedPenjualan);
    }
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedPenjualan) {
      // Logic untuk duplikat penjualan
      console.log("Duplikat penjualan:", selectedPenjualan);
    }
    handleMenuClose();
  };

  const handlePrintStruk = () => {
    if (selectedPenjualan) {
      handleDownloadStruk(selectedPenjualan.id_penjualan, selectedPenjualan.no_faktur);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedPenjualan) {
      if (window.confirm(`Apakah Anda yakin ingin menghapus penjualan ${selectedPenjualan.no_faktur}?`)) {
        console.log("Hapus penjualan:", selectedPenjualan);
        // api.delete(`/penjualan/${selectedPenjualan.id_penjualan}`).then(() => fetchRiwayat());
      }
    }
    handleMenuClose();
  };

  const getStatusColor = (total, bayar) => {
    const kembali = bayar - total;
    if (kembali < 0) return ERROR_COLOR;
    if (kembali === 0) return SUCCESS_COLOR;
    return "#ff9800"; // warning color
  };

  // Calculate statistics based on filtered data
  const calculateStatistics = () => {
    const totalPenjualan = filteredRiwayat.length;
    const totalNilai = filteredRiwayat.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const totalBayar = filteredRiwayat.reduce((sum, item) => sum + (Number(item.bayar) || 0), 0);
    const totalKembali = filteredRiwayat.reduce((sum, item) => sum + (Number(item.kembali) || 0), 0);

    return {
      totalPenjualan,
      totalNilai,
      totalBayar,
      totalKembali
    };
  };

  const statistics = calculateStatistics();

  // Paginate filtered data
  const paginatedRiwayat = filteredRiwayat.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate starting index for current page
  const getRowNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  return (
    <Box sx={{ p: 3, background: GRAY_BACKGROUND, minHeight: '100vh' }}>
      {/* Header Section */}
      <Card 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                backgroundColor: alpha(GRAY_DARK, 0.1),
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Receipt sx={{ fontSize: 32, color: GRAY_DARK }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="800"
                sx={{
                  background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Riwayat Penjualan
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola dan pantau semua transaksi penjualan
              </Typography>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                  boxShadow: '8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff',
                  border: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: alpha(GRAY_DARK, 0.1),
                        borderRadius: '10px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Receipt sx={{ fontSize: 20, color: GRAY_DARK }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                      Total Transaksi
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" color={GRAY_DARK}>
                    {statistics.totalPenjualan}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {start || end || searchTerm ? "Data sesuai filter" : "Total semua transaksi"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                  boxShadow: '8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff',
                  border: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: alpha(SUCCESS_COLOR, 0.1),
                        borderRadius: '10px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AttachMoney sx={{ fontSize: 20, color: SUCCESS_COLOR }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                      Total Nilai
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" color={SUCCESS_COLOR}>
                    {formatCurrency(statistics.totalNilai)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {start || end || searchTerm ? "Data sesuai filter" : "Total nilai penjualan"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                  boxShadow: '8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff',
                  border: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: alpha('#2196f3', 0.1),
                        borderRadius: '10px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Download sx={{ fontSize: 20, color: '#2196f3' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                      Total Bayar
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" color="#2196f3">
                    {formatCurrency(statistics.totalBayar)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {start || end || searchTerm ? "Data sesuai filter" : "Total uang masuk"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                  boxShadow: '8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff',
                  border: `1px solid ${alpha(GRAY_LIGHT, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: alpha('#ff9800', 0.1),
                        borderRadius: '10px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AttachMoney sx={{ fontSize: 20, color: '#ff9800' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                      Total Kembali
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" color="#ff9800">
                    {formatCurrency(statistics.totalKembali)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {start || end || searchTerm ? "Data sesuai filter" : "Total uang kembali"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filter Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: alpha(GRAY_DARK, 0.02),
              border: `1px solid ${alpha(GRAY_DARK, 0.1)}`
            }}
          >
            <Typography variant="h6" fontWeight="600" color={GRAY_DARK} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList /> Filter & Pencarian
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Cari no faktur atau nama kasir..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: GRAY_MEDIUM, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Tanggal Mulai"
                  InputLabelProps={{ shrink: true }}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: GRAY_MEDIUM, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Tanggal Akhir"
                  InputLabelProps={{ shrink: true }}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: GRAY_MEDIUM, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={handleResetFilter}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      fontWeight: '600',
                      textTransform: 'none',
                      borderColor: GRAY_LIGHT,
                      color: GRAY_MEDIUM,
                      '&:hover': {
                        borderColor: GRAY_DARK,
                        backgroundColor: alpha(GRAY_DARK, 0.05),
                      },
                    }}
                  >
                    Reset Filter
                  </Button>
                  <Button
                    variant="contained"
                    onClick={fetchRiwayat}
                    
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      fontWeight: '600',
                      textTransform: 'none',
                      background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
                      boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                        boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
                      },
                    }}
                  >
                    Refresh Data
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Info Filter Aktif */}
            {(start || end || searchTerm) && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Filter aktif:
                </Typography>
                {searchTerm && (
                  <Chip 
                    label={`Pencarian: "${searchTerm}"`} 
                    size="small" 
                    onDelete={() => setSearchTerm("")}
                  />
                )}
                {start && (
                  <Chip 
                    label={`Dari: ${new Date(start).toLocaleDateString('id-ID')}`} 
                    size="small" 
                    onDelete={() => setStart("")}
                  />
                )}
                {end && (
                  <Chip 
                    label={`Sampai: ${new Date(end).toLocaleDateString('id-ID')}`} 
                    size="small" 
                    onDelete={() => setEnd("")}
                  />
                )}
              </Box>
            )}
          </Paper>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card 
        sx={{ 
          borderRadius: 3,
          background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Table Header */}
          <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="700" color={GRAY_DARK}>
              📋 Daftar Transaksi ({statistics.totalPenjualan})
            </Typography>
            
            <Chip 
              label={`Halaman ${page + 1} dari ${Math.ceil(filteredRiwayat.length / rowsPerPage)}`}
              sx={{ 
                bgcolor: alpha(GRAY_DARK, 0.1), 
                color: GRAY_DARK,
                fontWeight: '600',
                fontSize: '0.75rem'
              }} 
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>No Faktur</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Tanggal</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Kasir</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'right' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'right' }}>Bayar</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'right' }}>Kembali</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 80 }}>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRiwayat.length > 0 ? (
                      paginatedRiwayat.map((row, index) => (
                        <TableRow 
                          key={row.id_penjualan}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: alpha(GRAY_DARK, 0.02),
                            }
                          }}
                        >
                          <TableCell>
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM} fontWeight="500">
                              {getRowNumber(index)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={row.no_faktur} 
                              size="small" 
                              sx={{ 
                                bgcolor: alpha(GRAY_DARK, 0.1), 
                                color: GRAY_DARK,
                                fontWeight: '600',
                                fontSize: '0.75rem'
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontSize="0.875rem">
                              {new Date(row.created_at || row.tgl_jual).toLocaleString("id-ID")}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Person sx={{ fontSize: 16, color: GRAY_MEDIUM }} />
                              <Typography fontSize="0.875rem">
                                {row.nama_user}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography fontWeight="600" fontSize="0.875rem">
                              {formatCurrency(row.total)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography fontSize="0.875rem" color={SUCCESS_COLOR}>
                              {formatCurrency(row.bayar)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography 
                              fontSize="0.875rem" 
                              fontWeight="600"
                              color={getStatusColor(row.total, row.bayar)}
                            >
                              {formatCurrency(row.kembali)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Tooltip title="Opsi Lainnya">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, row)}
                                sx={{
                                  color: GRAY_MEDIUM,
                                  '&:hover': {
                                    backgroundColor: alpha(GRAY_DARK, 0.1),
                                    color: GRAY_DARK,
                                  }
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <PointOfSale sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                          <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                            Tidak ada data transaksi
                          </Typography>
                          <Typography variant="body2" color={GRAY_LIGHT}>
                            {searchTerm || start || end 
                              ? "Coba ubah filter atau pencarian" 
                              : "Lakukan penjualan pertama Anda"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {filteredRiwayat.length > 0 && (
                <TablePagination
                  component="div"
                  count={filteredRiwayat.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem',
              gap: 1,
              py: 1,
            }
          }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); handlePreviewStruk(selectedPenjualan); }}>
          <Visibility fontSize="small" />
          Preview Struk
        </MenuItem>
        <MenuItem onClick={handlePrintStruk}>
          <Print fontSize="small" />
          Cetak Struk
        </MenuItem>
        <MenuItem onClick={handleViewDetail}>
          <Receipt fontSize="small" />
          Lihat Detail
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy fontSize="small" />
          Buat Salinan
        </MenuItem>
      </Menu>

      {/* Struk Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {strukLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress sx={{ color: GRAY_DARK }} />
            </Box>
          ) : selectedStruk && (
            <Box sx={{ p: 3 }}>
              {/* Struk Preview */}
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: WHITE,
                  border: `2px dashed ${alpha(GRAY_LIGHT, 0.5)}`,
                  maxWidth: 300,
                  mx: 'auto'
                }}
              >
                {/* Header Struk */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="800" color={GRAY_DARK}>
                    TOKO KITA
                  </Typography>
                  <Typography variant="caption" color={GRAY_MEDIUM}>
                    Jl. Ahmad Yani No.1, Banjar
                  </Typography>
                  <Box sx={{ my: 1, borderTop: `1px solid ${GRAY_LIGHT}` }} />
                </Box>

                {/* Info Transaksi */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="600">No Faktur:</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>{selectedStruk.no_faktur}</Typography>
                  <br />
                  <Typography variant="caption" fontWeight="600">Tanggal:</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {new Date(selectedStruk.created_at || selectedStruk.tgl_jual).toLocaleString("id-ID")}
                  </Typography>
                  <br />
                  <Typography variant="caption" fontWeight="600">Kasir:</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>{selectedStruk.nama_user}</Typography>
                </Box>

                <Box sx={{ my: 1, borderTop: `1px solid ${GRAY_LIGHT}` }} />

                {/* Total */}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight="600">Total:</Typography>
                    <Typography variant="caption" fontWeight="600">{formatCurrency(selectedStruk.total)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight="600">Bayar:</Typography>
                    <Typography variant="caption" fontWeight="600" color={SUCCESS_COLOR}>
                      {formatCurrency(selectedStruk.bayar)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" fontWeight="600">Kembali:</Typography>
                    <Typography variant="caption" fontWeight="600" color={getStatusColor(selectedStruk.total, selectedStruk.bayar)}>
                      {formatCurrency(selectedStruk.kembali)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ my: 1, borderTop: `1px solid ${GRAY_LIGHT}` }} />

                {/* Footer */}
                <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                  === Terima kasih ===
                </Typography>
              </Paper>

              <Alert 
                severity="info" 
                sx={{ mt: 2, borderRadius: 2 }}
                icon={<PictureAsPdf />}
              >
                Struk akan dicetak dalam format PDF dengan layout thermal printer
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            startIcon={<Close />}
            sx={{ 
              borderRadius: 2,
              fontWeight: '600',
              textTransform: 'none',
              borderColor: GRAY_LIGHT,
              color: GRAY_MEDIUM,
            }}
          >
            Tutup
          </Button>
          {selectedStruk && (
            <Button
              onClick={() => handleDownloadStruk(selectedStruk.id_penjualan, selectedStruk.no_faktur)}
              variant="contained"
              startIcon={<Download />}
              sx={{ 
                borderRadius: 2,
                fontWeight: '600',
                textTransform: 'none',
                background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
                boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
                '&:hover': {
                  background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                  boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
                },
              }}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}