import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  TablePagination,
  InputAdornment,
  alpha,
  Card,
  CardContent,
  Grid,
  TableContainer,
} from "@mui/material";
import { Edit, Delete, Add, Search, Refresh, MonetizationOn, CalendarToday } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../api";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", duration_days: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Ambil data plan
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscription");
      setPlans(res.data);
      setFilteredPlans(res.data);
      toast.success("Data plan berhasil dimuat");
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Gagal mengambil data plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.price.toString().includes(searchTerm) ||
        plan.duration_days.toString().includes(searchTerm)
      );
      setFilteredPlans(filtered);
    }
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, plans]);

  // Handle input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simpan data (add / update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/subscription/${editingPlan.id_plan}`, formData);
        toast.success("Plan berhasil diupdate");
      } else {
        await api.post("/subscription", formData);
        toast.success("Plan berhasil ditambahkan");
      }
      setOpenModal(false);
      setEditingPlan(null);
      setFormData({ name: "", price: "", duration_days: "" });
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan plan");
    }
  };

  // Edit
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration_days: plan.duration_days,
    });
    setOpenModal(true);
  };

  // Hapus
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus plan ini?")) return;
    try {
      await api.delete(`/subscription/${id}`);
      toast.success("Plan berhasil dihapus");
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus plan");
    }
  };

  // Reset form
  const handleAddNew = () => {
    setEditingPlan(null);
    setFormData({ name: "", price: "", duration_days: "" });
    setOpenModal(true);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated data
  const paginatedPlans = filteredPlans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate statistics
  const totalRevenue = plans.reduce((sum, plan) => sum + parseFloat(plan.price || 0), 0);
  const averagePrice = plans.length > 0 ? totalRevenue / plans.length : 0;
  const longestDuration = plans.length > 0 ? Math.max(...plans.map(p => p.duration_days)) : 0;

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
            Paket Langganan
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola paket langganan untuk perusahaan
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
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
          Tambah Plan
        </Button>
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
                <MonetizationOn sx={{ fontSize: 40, color: '#2c2c2c' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Plans
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                    {plans.length}
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
                <MonetizationOn sx={{ fontSize: 40, color: '#424242' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Rata-rata Harga
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#424242">
                    Rp {averagePrice.toLocaleString('id-ID')}
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
                <CalendarToday sx={{ fontSize: 40, color: '#616161' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Durasi Terlama
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#616161">
                    {longestDuration} hari
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
            {/* <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MonetizationOn sx={{ fontSize: 40, color: '#757575' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#757575">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </Box>
            </CardContent> */}
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
            placeholder="Cari plan berdasarkan nama, harga, atau durasi..."
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
            onClick={fetchPlans}
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
            <Typography>Memuat data...</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>No</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Nama Plan</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Harga</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Durasi (hari)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Tanggal Dibuat</TableCell>
                    <TableCell align="center" sx={{ fontWeight: '600', color: '#424242' }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPlans.length > 0 ? (
                    paginatedPlans.map((plan, index) => (
                      <TableRow 
                        key={plan.id_plan}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: alpha('#f5f5f5', 0.5),
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: '500' }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ fontWeight: '600', color: '#2c2c2c' }}>
                          {plan.name}
                        </TableCell>
                        <TableCell sx={{ fontWeight: '600', color: '#2e7d32' }}>
                          Rp {Number(plan.price).toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: 16, color: '#ed6c02' }} />
                            <Typography fontWeight="500">
                              {plan.duration_days} hari
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {new Date(plan.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          })}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEdit(plan)}
                              sx={{
                                backgroundColor: alpha('#1976d2', 0.1),
                                '&:hover': {
                                  backgroundColor: alpha('#1976d2', 0.2),
                                }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(plan.id_plan)}
                              sx={{
                                backgroundColor: alpha('#d32f2f', 0.1),
                                '&:hover': {
                                  backgroundColor: alpha('#d32f2f', 0.2),
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <MonetizationOn sx={{ fontSize: 48, color: '#bdbdbd' }} />
                          <Typography variant="h6" color="text.secondary">
                            Tidak ada data plan
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm ? `Tidak ditemukan hasil untuk "${searchTerm}"` : 'Mulai tambah plan pertama Anda'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredPlans.length > 0 && (
              <TablePagination
                component="div"
                count={filteredPlans.length}
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

      {/* Modal Add/Edit */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            width: 400,
            background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
            border: '1px solid rgba(255, 255, 255, 0.7)',
          }}
        >
          <Typography variant="h6" mb={3} fontWeight="600" color="#2c2c2c">
            {editingPlan ? "Edit Plan" : "Tambah Plan Baru"}
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Nama Plan"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Harga (Rp)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Durasi (hari)"
              name="duration_days"
              type="number"
              value={formData.duration_days}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
              <Button 
                onClick={() => setOpenModal(false)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: '600',
                  color: '#616161'
                }}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: '600',
                  background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
                  boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
                  '&:hover': {
                    background: `linear-gradient(45deg, #424242 30%, #616161 90%)`,
                    boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
                  },
                }}
              >
                {editingPlan ? "Simpan Perubahan" : "Tambah Plan"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}