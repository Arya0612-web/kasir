import { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Person,
  AccountCircle,
  Lock,
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

// Komponen Edit Drawer untuk Kasir
const EditDrawer = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState({
    nama_user: "",
    username: "",
    pass: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_user: data.nama_user || "",
        username: data.username || "",
        pass: "", // Password dikosongkan saat edit
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_user.trim()) {
      toast.error("Nama kasir harus diisi");
      return;
    }
    if (!form.username.trim()) {
      toast.error("Username harus diisi");
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
            Edit Kasir
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="nama_user"
            label="Nama Kasir"
            value={form.nama_user}
            onChange={handleChange}
            placeholder="Masukkan nama kasir"
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

          {/* Info Kasir */}
          <Paper
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Kasir
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Kasir:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.id_user}</Typography>
            </Box>
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

// Komponen Actions Menu dengan Tooltip untuk Kasir
const ActionsMenu = ({ data, onDelete, onEdit }) => {
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
      />

      {/* Delete Dialog untuk Kasir */}
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
            Hapus Kasir
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus kasir{" "}
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

export default function AddKasir() {
  const [form, setForm] = useState({
    nama_user: "",
    username: "",
    pass: "",
  });
  const [kasirList, setKasirList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil daftar kasir
  useEffect(() => {
    const fetchKasir = async () => {
      setLoadingList(true);
      try {
        const res = await api.get("/kasir");
        setKasirList(res.data);
      } catch (err) {
        console.error("Gagal ambil kasir:", err);
        toast.error("Gagal memuat data kasir");
      } finally {
        setLoadingList(false);
      }
    };
    fetchKasir();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_user.trim()) {
      toast.error("Nama kasir harus diisi");
      return;
    }
    if (!form.username.trim()) {
      toast.error("Username harus diisi");
      return;
    }
    if (!form.pass.trim()) {
      toast.error("Password harus diisi");
      return;
    }

    setLoading(true);
    try {
      await api.post("/kasir", form);
      toast.success("Kasir berhasil ditambahkan");
      resetForm();
      
      // Refresh daftar kasir
      const res = await api.get("/kasir");
      setKasirList(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Gagal menambah kasir");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      await api.put(`/kasir/${id}`, formData);
      toast.success("Kasir berhasil diupdate");
      
      // Refresh daftar kasir
      const res = await api.get("/kasir");
      setKasirList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupdate kasir");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/kasir/${id}`);
      toast.success("Kasir berhasil dihapus");
      
      // Refresh daftar kasir
      const res = await api.get("/kasir");
      setKasirList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus kasir");
    }
  };

  const resetForm = () => {
    setForm({
      nama_user: "",
      username: "",
      pass: "",
    });
  };

  const refreshKasirList = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/kasir");
      setKasirList(res.data);
    } catch (err) {
      toast.error("Gagal memuat data kasir");
    } finally {
      setLoadingList(false);
    }
  };

  const filteredKasir = kasirList.filter(kasir =>
    kasir.nama_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kasir.username.toLowerCase().includes(searchTerm.toLowerCase())
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
                Kelola Kasir
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola data akun kasir toko Anda
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
        </Box>
      </Fade>

      {/* Content Section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Form Section */}
        <Box sx={{ width: { xs: '100%', lg: 400 } }}>
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
                  Tambah Kasir Baru
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    name="nama_user"
                    label="Nama Kasir"
                    value={form.nama_user}
                    onChange={handleChange}
                    placeholder="Masukkan nama kasir"
                    size="small"
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    name="username"
                    label="Username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    size="small"
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                        </InputAdornment>
                      ),
                    }}
                  />

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
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    startIcon={loading ? <CircularProgress size={16} /> : <Add />}
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
                    {loading ? 'Menyimpan...' : 'Tambah Kasir'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Box>

        {/* Table Section */}
        <Box sx={{ flex: 1 }}>
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
                  📋 Daftar Kasir ({kasirList.length})
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Cari kasir..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                      onClick={refreshKasirList}
                      size="small"
                      sx={{
                        bgcolor: alpha(GRAY_DARK, 0.1),
                        color: GRAY_DARK,
                        '&:hover': {
                          bgcolor: GRAY_DARK,
                          color: WHITE,
                        },
                      }}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {loadingList ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
                </Box>
              ) : filteredKasir.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Person sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                  <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                    {searchTerm ? 'Kasir tidak ditemukan' : 'Belum ada data kasir'}
                  </Typography>
                  <Typography variant="body2" color={GRAY_LIGHT}>
                    {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan kasir pertama Anda'}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Kasir</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Tanggal Dibuat</TableCell>
                        <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredKasir.map((kasir) => (
                        <TableRow 
                          key={kasir.id_user}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: alpha(GRAY_DARK, 0.02),
                            }
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight="500" fontSize="0.875rem" color={GRAY_DARK}>
                              {kasir.nama_user}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                              {kasir.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                              {new Date(kasir.created_at).toLocaleDateString("id-ID")}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <ActionsMenu 
                              data={kasir}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Table Footer */}
              {filteredKasir.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3,
                  pt: 2,
                  borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
                }}>
                  <Typography variant="caption" color={GRAY_MEDIUM}>
                    Menampilkan {filteredKasir.length} dari {kasirList.length} kasir
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
        </Box>
      </Box>
    </Container>
  );
}