import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  alpha,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  TablePagination,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Menu
} from "@mui/material";
import {
  Add,
  Search,
  Refresh,
  Visibility,
  Edit,
  Receipt,
  LocalShipping,
  CalendarToday,
  Person,
  FilterList,
  MoreVert,
  ContentCopy,
  Star,
  StarBorder,
  Delete
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import id from "date-fns/locale/id";

export default function DaftarPembelian() {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("semua");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPembelian, setSelectedPembelian] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchPembelian();
  }, []);

  const fetchPembelian = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/pembelian");
      setPembelian(res.data);
    } catch (err) {
      console.error("Gagal memuat data pembelian:", err);
      setError("Gagal memuat data pembelian");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusPembayaran = (sisa) => {
    if (sisa === 0) return { label: 'Lunas', color: 'success' };
    return { label: 'Cicilan', color: 'warning' };
  };

  // Menu handlers
  const handleMenuOpen = (event, pembelian) => {
    setAnchorEl(event.currentTarget);
    setSelectedPembelian(pembelian);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPembelian(null);
  };

  const handleEdit = () => {
    if (selectedPembelian) {
      navigate(`/editpembelian/${selectedPembelian.id_beli}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedPembelian) {
      navigate(`/pembelian/${selectedPembelian.id_beli}`);
    }
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedPembelian) {
      // Logic untuk membuat salinan pembelian
      console.log("Membuat salinan pembelian:", selectedPembelian);
      // navigate("/addpembelian", { state: { duplicate: selectedPembelian } });
    }
    handleMenuClose();
  };

  const handleToggleFavorite = () => {
    if (selectedPembelian) {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(selectedPembelian.id_beli)) {
        newFavorites.delete(selectedPembelian.id_beli);
      } else {
        newFavorites.add(selectedPembelian.id_beli);
      }
      setFavorites(newFavorites);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedPembelian) {
      // Logic untuk menghapus pembelian
      if (window.confirm(`Apakah Anda yakin ingin menghapus pembelian ${selectedPembelian.no_faktur}?`)) {
        console.log("Menghapus pembelian:", selectedPembelian);
        // api.delete(`/pembelian/${selectedPembelian.id_beli}`).then(() => fetchPembelian());
      }
    }
    handleMenuClose();
  };

  // Filter data berdasarkan pencarian, tanggal, dan status
  const filteredPembelian = pembelian.filter(p => {
    const matchesSearch = 
      p.no_faktur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nama_supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tgl_beli?.toLowerCase().includes(searchTerm.toLowerCase());

    const purchaseDate = new Date(p.tgl_beli);
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;
    
    const matchesStartDate = !startDateObj || purchaseDate >= new Date(startDateObj.setHours(0, 0, 0, 0));
    const matchesEndDate = !endDateObj || purchaseDate <= new Date(endDateObj.setHours(23, 59, 59, 999));

    const matchesStatus = 
      statusFilter === "semua" ||
      (statusFilter === "lunas" && p.sisa === 0) ||
      (statusFilter === "cicilan" && p.sisa > 0);

    return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus;
  });

  // Hitung statistik berdasarkan data yang sudah difilter
  const totalPembelian = filteredPembelian.length;
  const totalNilai = filteredPembelian.reduce((sum, p) => sum + (p.total || 0), 0);
  const pembelianLunas = filteredPembelian.filter(p => p.sisa === 0).length;
  const totalSupplier = new Set(filteredPembelian.map(p => p.id_supplier)).size;

  // Pagination
  const paginatedPembelian = filteredPembelian.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset filter
  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setStatusFilter("semua");
    setSearchTerm("");
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight="700"
              sx={{
                background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Daftar Pembelian
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Kelola data pembelian barang dari supplier
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/addpembelian")}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: '600',
              textTransform: 'none',
              background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
              boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': {
                background: `linear-gradient(45deg, #424242 30%, #616161 90%)`,
                boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
              },
            }}
          >
            Tambah Pembelian
          </Button>
        </Box>

        {/* Statistics Cards - MENGGUNAKAN DATA FILTERED */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
                boxShadow: '15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Pembelian
                </Typography>
                <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                  {totalPembelian}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {startDate || endDate || statusFilter !== "semua" || searchTerm 
                    ? "Data sesuai filter" 
                    : `Total semua: ${pembelian.length}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
                boxShadow: '15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Nilai
                </Typography>
                <Typography variant="h4" fontWeight="700" color="#424242">
                  {formatCurrency(totalNilai)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {startDate || endDate || statusFilter !== "semua" || searchTerm 
                    ? "Data sesuai filter" 
                    : `Total semua: ${formatCurrency(pembelian.reduce((sum, p) => sum + (p.total || 0), 0))}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
                boxShadow: '15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Pembelian Lunas
                </Typography>
                <Typography variant="h4" fontWeight="700" color="#616161">
                  {pembelianLunas}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {startDate || endDate || statusFilter !== "semua" || searchTerm 
                    ? "Data sesuai filter" 
                    : `Total semua: ${pembelian.filter(p => p.sisa === 0).length}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
                boxShadow: '15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Supplier
                </Typography>
                <Typography variant="h4" fontWeight="700" color="#757575">
                  {totalSupplier}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {startDate || endDate || statusFilter !== "semua" || searchTerm 
                    ? "Data sesuai filter" 
                    : `Total semua: ${new Set(pembelian.map(p => p.id_supplier)).size}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
            boxShadow: '15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff',
            border: '1px solid rgba(255, 255, 255, 0.7)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Cari "
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#616161' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha('#fff', 0.8),
                    '&:hover fieldset': {
                      borderColor: '#9e9e9e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#616161',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Dari Tanggal"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: { borderRadius: 2 }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Sampai Tanggal"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: { borderRadius: 2 }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="semua">Semua Status</MenuItem>
                  <MenuItem value="lunas">Lunas</MenuItem>
                  <MenuItem value="cicilan">Cicilan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Reset Filter">
                  <IconButton
                    onClick={resetFilters}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: alpha('#f5f5f5', 0.8),
                      '&:hover': {
                        backgroundColor: alpha('#e0e0e0', 0.8),
                      },
                    }}
                  >
                    <FilterList />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={fetchPembelian}
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: alpha('#f5f5f5', 0.8),
                      '&:hover': {
                        backgroundColor: alpha('#e0e0e0', 0.8),
                      },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {/* Info Filter Aktif */}
          {(startDate || endDate || statusFilter !== "semua" || searchTerm) && (
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
              {startDate && (
                <Chip 
                  label={`Dari: ${formatDate(startDate)}`} 
                  size="small" 
                  onDelete={() => setStartDate(null)}
                />
              )}
              {endDate && (
                <Chip 
                  label={`Sampai: ${formatDate(endDate)}`} 
                  size="small" 
                  onDelete={() => setEndDate(null)}
                />
              )}
              {statusFilter !== "semua" && (
                <Chip 
                  label={`Status: ${statusFilter === "lunas" ? "Lunas" : "Cicilan"}`} 
                  size="small" 
                  onDelete={() => setStatusFilter("semua")}
                />
              )}
              {/* <Button 
                size="small" 
                onClick={resetFilters}
                sx={{ ml: 1 }}
              >
                Hapus Semua Filter
              </Button> */}
            </Box>
          )}
        </Paper>

        {/* Data Table */}
        <Paper 
          elevation={0}
          sx={{
            borderRadius: 3,
            background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
            boxShadow: '15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress sx={{ color: '#616161' }} />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column' }}>
              <Receipt sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
              <Typography color="text.secondary">{error}</Typography>
              <Button onClick={fetchPembelian} sx={{ mt: 2 }}>Coba Lagi</Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>No Faktur</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Tanggal</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Supplier</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Bayar</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Sisa</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Dibuat</TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#424242', textAlign: 'center', width: '120px' }}>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPembelian.map((p) => {
                      const status = getStatusPembayaran(p.sisa);
                      const isFavorite = favorites.has(p.id_beli);
                      
                      return (
                        <TableRow 
                          key={p.id_beli}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: alpha('#f5f5f5', 0.5),
                            }
                          }}
                        >
                          <TableCell sx={{ fontWeight: '500' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Receipt sx={{ fontSize: 16, color: '#9e9e9e' }} />
                              {p.no_faktur}
                              {isFavorite && (
                                <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday sx={{ fontSize: 16, color: '#9e9e9e' }} />
                              {formatDate(p.tgl_beli)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocalShipping sx={{ fontSize: 16, color: '#9e9e9e' }} />
                              {p.nama_supplier}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: '600' }}>{formatCurrency(p.total)}</TableCell>
                          <TableCell>{formatCurrency(p.bayar)}</TableCell>
                          <TableCell sx={{ fontWeight: '600', color: p.sisa > 0 ? '#d32f2f' : '#2e7d32' }}>
                            {formatCurrency(p.sisa)}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={status.label} 
                              size="small" 
                              color={status.color}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {p.created_at ? formatDateTime(p.created_at) : "-"}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              {/* <Tooltip title="Lihat Detail">
                                <IconButton 
                                  size="small" 
                                  onClick={() => navigate(`/pembelian/${p.id_beli}`)}
                                  sx={{ 
                                    color: '#616161',
                                    '&:hover': { backgroundColor: alpha('#616161', 0.1) }
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip> */}
                              
                              <Tooltip title="Opsi Lainnya">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => handleMenuOpen(e, p)}
                                  sx={{ 
                                    color: '#757575',
                                    '&:hover': { backgroundColor: alpha('#757575', 0.1) }
                                  }}
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {filteredPembelian.length === 0 && !loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', flexDirection: 'column' }}>
                    <Receipt sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
                    <Typography color="text.secondary">Tidak ada data pembelian</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || startDate || endDate || statusFilter !== "semua" 
                        ? `Tidak ditemukan hasil dengan filter yang dipilih` 
                        : 'Mulai tambah pembelian pertama Anda'}
                    </Typography>
                    {(searchTerm || startDate || endDate || statusFilter !== "semua") && (
                      <Button onClick={resetFilters} sx={{ mt: 1 }}>
                        Reset Filter
                      </Button>
                    )}
                  </Box>
                )}
              </TableContainer>
              
              {/* Pagination */}
              {filteredPembelian.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredPembelian.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Baris per halaman:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
                  }
                />
              )}
            </>
          )}
        </Paper>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 180,
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                gap: 1,
              }
            }
          }}
        >
          
          <MenuItem onClick={handleView}>
            <Visibility fontSize="small" />
            Lihat Detail
          </MenuItem>
          <MenuItem onClick={handleDuplicate}>
            <ContentCopy fontSize="small" />
            Buat Salinan
          </MenuItem>
          <MenuItem onClick={handleToggleFavorite}>
            {favorites.has(selectedPembelian?.id_beli) ? (
              <Star fontSize="small" sx={{ color: '#ffc107' }} />
            ) : (
              <StarBorder fontSize="small" />
            )}
            {favorites.has(selectedPembelian?.id_beli) ? 'Hapus Favorit' : 'Favorit'}
          </MenuItem>
          
        </Menu>
      </Box>
    </LocalizationProvider>
  );
}