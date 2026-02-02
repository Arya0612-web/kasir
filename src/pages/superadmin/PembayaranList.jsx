import { useEffect, useState } from "react";
import api from "../../api";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  alpha,
  Paper,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  TablePagination,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Search, Refresh, Visibility, CheckCircle, Cancel, Receipt } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function PembayaranList() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payments", { withCredentials: true });
      if (res.data.success) {
        setData(res.data.data);
        setFilteredData(res.data.data);
        toast.success("Data pembayaran berhasil dimuat");
      } else {
        toast.error("Gagal memuat data pembayaran");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(payment =>
        payment.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount?.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    }
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, data]);

  const handleStatusChange = async (id, perusahaan_id, plan_days, status) => {
    try {
      await api.put(
        `/payments/${id}/status`,
        { status, perusahaan_id, plan_days },
        { withCredentials: true }
      );
      toast.success(`Pembayaran berhasil ${status === "verified" ? "diverifikasi" : "ditolak"}`);
      fetchPayments();
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error(err.response?.data?.message || "Gagal mengubah status pembayaran");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate statistics
  const pendingCount = data.filter(p => p.status === "pending").length;
  const verifiedCount = data.filter(p => p.status === "verified").length;
  const rejectedCount = data.filter(p => p.status === "rejected").length;
  const totalAmount = data
    .filter(p => p.status === "verified")
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
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
            Manajemen Pembayaran
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola verifikasi pembayaran langganan perusahaan
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Receipt sx={{ fontSize: 40, color: '#2c2c2c' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total 
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                    {data.length}
                  </Typography>
                </Box>
              </Box>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Receipt sx={{ fontSize: 40, color: '#ed6c02' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Menunggu
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#ed6c02">
                    {pendingCount}
                  </Typography>
                </Box>
              </Box>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Receipt sx={{ fontSize: 40, color: '#2e7d32' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Terverifikasi
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#2e7d32">
                    {verifiedCount}
                  </Typography>
                </Box>
              </Box>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Receipt sx={{ fontSize: 40, color: '#757575' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Nilai
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#757575">
                    {formatCurrency(totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Cari pembayaran berdasarkan perusahaan, plan, atau status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          
          <IconButton
            onClick={fetchPayments}
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
        </Box>
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
            <Typography>Memuat data pembayaran...</Typography>
          </Box>
        ) : paginatedData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column' }}>
            <Receipt sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tidak ada data pembayaran
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? `Tidak ditemukan hasil untuk "${searchTerm}"` : 'Belum ada pembayaran yang perlu diverifikasi'}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>No</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Perusahaan</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Plan</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Jumlah</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Durasi</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: '600', color: '#424242' }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((payment, index) => (
                    <TableRow 
                      key={payment.id}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: alpha('#f5f5f5', 0.5),
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: '500' }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="600" color="#2c2c2c">
                          {payment.nama_perusahaan}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {payment.plan_name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600', color: '#2e7d32' }}>
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.duration_days} hari
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color={getStatusColor(payment.status)}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: '600', textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            color="primary" 
                            onClick={() => { setSelected(payment); setOpen(true); }}
                            sx={{
                              backgroundColor: alpha('#1976d2', 0.1),
                              '&:hover': {
                                backgroundColor: alpha('#1976d2', 0.2),
                              }
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>

                          {payment.status === "pending" && (
                            <>
                              <IconButton
                                color="success"
                                onClick={() => handleStatusChange(payment.id, payment.perusahaan_id, payment.plan_days, "verified")}
                                sx={{
                                  backgroundColor: alpha('#2e7d32', 0.1),
                                  '&:hover': {
                                    backgroundColor: alpha('#2e7d32', 0.2),
                                  }
                                }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleStatusChange(payment.id, payment.perusahaan_id, payment.plan_days, "rejected")}
                                sx={{
                                  backgroundColor: alpha('#d32f2f', 0.1),
                                  '&:hover': {
                                    backgroundColor: alpha('#d32f2f', 0.2),
                                  }
                                }}
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Baris per halaman:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
                }
                sx={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                }}
              />
            )}
          </>
        )}
      </Paper>

      {/* Modal detail pembayaran */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
            boxShadow: '20px 20px 40px #d9d9d9, -20px -20px 40px #ffffff',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '600', color: '#2c2c2c' }}>
          Detail Pembayaran
        </DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#424242', fontWeight: '600' }}>
                    Informasi Pembayaran
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Perusahaan</Typography>
                      <Typography fontWeight="600">{selected.nama_perusahaan}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Plan</Typography>
                      <Typography fontWeight="600">{selected.plan_name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Durasi</Typography>
                      <Typography fontWeight="600">{selected.duration_days} hari</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Jumlah</Typography>
                      <Typography fontWeight="600" sx={{ color: '#2e7d32' }}>
                        {formatCurrency(selected.amount)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip 
                        label={selected.status} 
                        color={getStatusColor(selected.status)}
                        variant="outlined"
                        sx={{ fontWeight: '600', textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#424242', fontWeight: '600' }}>
                    Bukti Pembayaran
                  </Typography>
                  <Box
                    component="img"
                    src={`http://localhost:5000${selected.bukti_pembayaran}`}
                    alt="Bukti Pembayaran"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      maxHeight: 300,
                      objectFit: 'contain'
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: '600',
              color: '#616161'
            }}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}