import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  alpha,
  Card,
  CardContent,
  IconButton,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fade,
  Container,
  Divider,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Grid,
} from "@mui/material";
import {
  Person,
  AccountCircle,
  Lock,
  Store,
  Add,
  Refresh,
  ArrowBack,
  Edit,
  Delete,
  MoreVert,
  Close,
  Search,
  ContentCopy,
  Favorite,
  Save,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

// Warna palette hitam putih
const BLACK = "#000000";
const WHITE = "#ffffff";
const GRAY_DARK = "#2c2c2c";
const GRAY_MEDIUM = "#5a5a5a";
const GRAY_LIGHT = "#616161";
const GRAY_BACKGROUND = "#f8f9fa";
const SUCCESS_COLOR = "#4caf50";
const ERROR_COLOR = "#f44336";

// Komponen Edit Drawer untuk Admin
const EditDrawer = ({ open, onClose, data, onSave, selectedToko, tokoList }) => {
  const [form, setForm] = useState({
    username: "",
    pass: "",
    nama_user: "",
    id_toko: selectedToko // Otomatis menggunakan toko yang dipilih di filter
  });

  useEffect(() => {
    if (data) {
      setForm({
        username: data.username || "",
        pass: "", // Password dikosongkan saat edit
        nama_user: data.nama_user || "",
        id_toko: selectedToko // Otomatis menggunakan toko yang dipilih di filter
      });
    }
  }, [data, selectedToko]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.username.trim()) {
      toast.error("Username harus diisi");
      return;
    }
    if (!form.nama_user.trim()) {
      toast.error("Nama admin harus diisi");
      return;
    }
    if (!form.id_toko) {
      toast.error("Toko harus dipilih");
      return;
    }
    onSave(data.id_user, form);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 500 },
          background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight="600" color={GRAY_DARK}>
            Edit Admin
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            placeholder="Masukkan username"
            size="small"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: GRAY_MEDIUM }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password (kosongkan jika tidak diubah)"
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            placeholder="Masukkan password baru"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: GRAY_MEDIUM }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="nama_user"
            label="Nama Admin"
            value={form.nama_user}
            onChange={handleChange}
            placeholder="Masukkan nama admin"
            size="small"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: GRAY_MEDIUM }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Field Toko yang otomatis terisi berdasarkan filter */}
          <TextField
            fullWidth
            label="Toko"
            value={tokoList.find(t => t.id_toko === selectedToko)?.nama_toko || ''}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Store sx={{ color: GRAY_MEDIUM }} />
                </InputAdornment>
              ),
            }}
            size="small"
            helperText="Toko otomatis sesuai dengan filter yang dipilih"
          />

          {/* Info Admin */}
          <Paper
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Admin
            </Typography>
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Admin:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.id_user}</Typography>
            </Box> */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>Tanggal Dibuat:</Typography>
              <Typography variant="caption" fontWeight="700">
                {data?.created_at ? new Date(data.created_at).toLocaleDateString("id-ID") : '-'}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>Status:</Typography>
              <Chip 
                label="Aktif" 
                size="small" 
                color="success"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: '600',
              borderColor: GRAY_LIGHT,
              color: GRAY_MEDIUM,
            }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: '600',
              background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
              boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': {
                background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
              },
            }}
          >
            Simpan Perubahan
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

// Komponen Actions Menu dengan Tooltip untuk Admin
const ActionsMenu = ({ data, onDelete, onEdit, selectedToko, tokoList }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditDrawerOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleMakeCopy = () => {
    toast.info("Fitur salin data akan segera tersedia");
    handleMenuClose();
  };

  const handleFavorite = () => {
    toast.info("Fitur favorit akan segera tersedia");
    handleMenuClose();
  };

  return (
    <>
      <Tooltip title="Menu aksi">
        <IconButton 
          size="small"
          onClick={handleMenuOpen}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              py: 1,
              px: 2,
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMakeCopy}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Buat Salinan</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleFavorite}>
          <ListItemIcon>
            <Favorite fontSize="small" />
          </ListItemIcon>
          <ListItemText>Favorit</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Hapus</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Drawer */}
      <EditDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        data={data}
        onSave={onEdit}
        selectedToko={selectedToko}
        tokoList={tokoList}
      />

      {/* Delete Dialog untuk Admin */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600" color={GRAY_DARK}>
            Hapus Admin
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus admin{" "}
            <strong>"{data?.nama_user}"</strong>?
          </Typography>
          <Typography variant="body2" color={GRAY_MEDIUM} sx={{ mb: 2 }}>
            Username: {data?.username}
          </Typography>
          <Alert severity="warning">
            Tindakan ini tidak dapat dibatalkan! Data akan dihapus secara permanen.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: '600',
              borderColor: GRAY_LIGHT,
              color: GRAY_MEDIUM,
            }}
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              onDelete(data.id_user);
              setDeleteDialogOpen(false);
            }}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: '600',
              background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #c62828 30%, #e53935 90%)',
              },
            }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function AddAdmin() {
  const [form, setForm] = useState({
    username: "",
    pass: "",
    nama_user: "",
    id_toko: ""
  });
  const [tokoList, setTokoList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [selectedToko, setSelectedToko] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil daftar toko
  useEffect(() => {
    const fetchToko = async () => {
      try {
        const res = await api.get("/toko");
        setTokoList(res.data);
      } catch (err) {
        console.error("Gagal ambil toko:", err);
        toast.error("Gagal memuat data toko");
      }
    };
    fetchToko();
  }, []);

  // Ambil daftar admin berdasarkan toko terpilih
  useEffect(() => {
    const fetchAdmin = async () => {
      if (!selectedToko) return;
      setLoadingList(true);
      try {
        const res = await api.get(`/admin/by-toko/${selectedToko}`);
        setAdminList(res.data);
      } catch (err) {
        console.error("Gagal ambil admin:", err);
        toast.error("Gagal memuat data admin");
      } finally {
        setLoadingList(false);
      }
    };
    fetchAdmin();
  }, [selectedToko]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTokoChange = (e) => {
    const tokoId = e.target.value;
    setSelectedToko(tokoId);
    // Otomatis set id_toko di form tambah admin sesuai dengan filter
    setForm(prev => ({ ...prev, id_toko: tokoId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) {
      toast.error("Username harus diisi");
      return;
    }
    if (!form.pass.trim()) {
      toast.error("Password harus diisi");
      return;
    }
    if (!form.nama_user.trim()) {
      toast.error("Nama admin harus diisi");
      return;
    }
    if (!form.id_toko) {
      toast.error("Toko harus dipilih");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/create", form);
      toast.success("Admin berhasil ditambahkan");
      resetForm();
      setOpenModal(false);
      
      // Refresh daftar admin jika toko yang dipilih sama
      if (selectedToko === form.id_toko) {
        const res = await api.get(`/admin/by-toko/${form.id_toko}`);
        setAdminList(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Gagal menambah admin");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      await api.put(`/admin/${id}`, formData);
      toast.success("Admin berhasil diupdate");
      
      // Refresh daftar admin
      if (selectedToko) {
        const res = await api.get(`/admin/by-toko/${selectedToko}`);
        setAdminList(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupdate admin");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/${id}`);
      toast.success("Admin berhasil dihapus");
      
      // Refresh daftar admin
      if (selectedToko) {
        const res = await api.get(`/admin/by-toko/${selectedToko}`);
        setAdminList(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus admin");
    }
  };

  const resetForm = () => {
    setForm({
      username: "",
      pass: "",
      nama_user: "",
      id_toko: selectedToko // Tetap pertahankan toko yang dipilih di filter
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
    resetForm();
  };

  const refreshAdminList = async () => {
    if (!selectedToko) return;
    setLoadingList(true);
    try {
      const res = await api.get(`/admin/by-toko/${selectedToko}`);
      setAdminList(res.data);
    } catch (err) {
      toast.error("Gagal memuat data admin");
    } finally {
      setLoadingList(false);
    }
  };

  const filteredAdmins = adminList.filter(admin =>
    admin.nama_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {/* <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: GRAY_DARK,
                '&:hover': {
                  backgroundColor: alpha(GRAY_DARK, 0.1),
                }
              }}
            >
              <ArrowBack />
            </IconButton> */}
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
              <Person sx={{ fontSize: 32, color: GRAY_DARK }} />
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
                Kelola Admin
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola data admin toko Anda
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Filter Toko Section */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={1200}>
            <Card 
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" color={GRAY_DARK} sx={{ mb: 2 }}>
                  Filter Toko
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedToko}
                    onChange={handleTokoChange}
                    displayEmpty
                    size="small"
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="">-- Pilih Toko --</MenuItem>
                    {tokoList.map((toko) => (
                      <MenuItem key={toko.id_toko} value={toko.id_toko}>
                        {toko.nama_toko}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Table Section */}
        <div style={{ width: '100%' }}>
          <Fade in timeout={1400}>
            <Box
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                overflow: 'hidden',
              }}
            >
              {/* Table Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 3,
                pb: 2
              }}>
                <Typography variant="h6" fontWeight="700" color={GRAY_DARK}>
                  📋 Daftar Admin ({adminList.length})
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenModal(true)}
                    disabled={!selectedToko}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      fontWeight: '600',
                      textTransform: 'none',
                      background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
                      boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                        boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
                      },
                      '&:disabled': {
                        background: GRAY_LIGHT,
                        color: WHITE,
                      }
                    }}
                  >
                    Tambah
                  </Button>
                  
                  <TextField
                    size="small"
                    placeholder="Cari admin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!selectedToko}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: GRAY_MEDIUM, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: 250,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  
                  <Tooltip title="Refresh Data">
                    <IconButton
                      onClick={refreshAdminList}
                      size="small"
                      disabled={!selectedToko}
                      sx={{
                        bgcolor: alpha(GRAY_DARK, 0.1),
                        color: GRAY_DARK,
                        '&:hover': {
                          bgcolor: GRAY_DARK,
                          color: WHITE,
                        },
                        '&:disabled': {
                          bgcolor: alpha(GRAY_LIGHT, 0.3),
                          color: GRAY_LIGHT,
                        }
                      }}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {!selectedToko ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Store sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                  <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                    Pilih toko terlebih dahulu
                  </Typography>
                  <Typography variant="body2" color={GRAY_LIGHT}>
                    Pilih toko untuk melihat daftar admin
                  </Typography>
                </Box>
              ) : loadingList ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
                </Box>
              ) : filteredAdmins.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Person sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                  <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                    {searchTerm ? 'Admin tidak ditemukan' : 'Belum ada data admin'}
                  </Typography>
                  <Typography variant="body2" color={GRAY_LIGHT}>
                    {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan admin pertama untuk toko ini'}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Admin</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Toko</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Tanggal Dibuat</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAdmins.map((admin, index) => (
                        <TableRow 
                          key={admin.id_user}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: alpha(GRAY_DARK, 0.02),
                            }
                          }}
                        >
                          <TableCell>
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="500" fontSize="0.875rem" color={GRAY_DARK}>
                              {admin.nama_user}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                              {admin.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                           <Chip 
                              label={admin.nama_toko || '-'}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderColor: alpha(GRAY_DARK, 0.3),
                                color: GRAY_DARK,
                                fontSize: '0.75rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                              {new Date(admin.created_at).toLocaleDateString("id-ID")}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <ActionsMenu 
                              data={admin}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                              selectedToko={selectedToko}
                              tokoList={tokoList}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Table Footer */}
              {selectedToko && filteredAdmins.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3,
                  pt: 2,
                  borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
                }}>
                  <Typography variant="caption" color={GRAY_MEDIUM}>
                    Menampilkan {filteredAdmins.length} dari {adminList.length} admin
                  </Typography>
                  {searchTerm && (
                    <Chip 
                      label={`Pencarian: "${searchTerm}"`} 
                      size="small" 
                      onDelete={() => setSearchTerm("")}
                      sx={{ 
                        bgcolor: alpha(GRAY_DARK, 0.1), 
                        color: GRAY_DARK,
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        </div>
      </Grid>

      {/* Modal Tambah Admin */}
      <Dialog 
        open={openModal} 
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
            boxShadow: '20px 20px 40px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: '700', 
          color: GRAY_DARK,
          borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              backgroundColor: alpha(GRAY_DARK, 0.1),
              borderRadius: '12px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Add sx={{ fontSize: 24, color: GRAY_DARK }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700">
                Tambah Admin Baru
              </Typography>
              <Typography variant="body2" color={GRAY_MEDIUM}>
                Isi informasi detail admin
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="pass"
                  value={form.pass}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="nama_user"
                  label="Nama Admin"
                  value={form.nama_user}
                  onChange={handleChange}
                  placeholder="Masukkan nama admin"
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Field Toko yang otomatis terisi berdasarkan filter */}
                <TextField
                  fullWidth
                  label="Toko"
                  value={tokoList.find(t => t.id_toko === selectedToko)?.nama_toko || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Store sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  helperText="Toko otomatis sesuai dengan filter yang dipilih"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`
        }}>
          <Button
            onClick={handleModalClose}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: '600',
              borderColor: GRAY_LIGHT,
              color: GRAY_MEDIUM,
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            fullWidth
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: '600',
              background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
              boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': {
                background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
              },
              '&:disabled': {
                background: GRAY_LIGHT,
                color: WHITE,
              }
            }}
          >
            {loading ? 'Menyimpan...' : 'Simpan Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}