import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  alpha,
  InputAdornment,
  Chip,
  Fade,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import {
  Save,
  Add,
  Edit,
  Delete,
  LocationOn,
  WhatsApp,
  Person,
  CheckCircle,
  Close,
  Search,
  Refresh,
  MoreVert,
  ContentCopy,
  Favorite,
} from "@mui/icons-material";
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

// Komponen Edit Drawer untuk Supplier
const EditDrawer = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState({
    nama_supplier: "",
    alamat: "",
    wa: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_supplier: data.nama_supplier || "",
        alamat: data.alamat || "",
        wa: data.wa || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_supplier.trim()) {
      toast.error("Nama supplier harus diisi");
      return;
    }
    if (!form.wa.trim()) {
      toast.error("Nomor WhatsApp harus diisi");
      return;
    }
    onSave(data.supplier_id, form);
  };

  const formatWhatsApp = (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.startsWith("0")) return "62" + numbers.slice(1);
    if (numbers.startsWith("62")) return numbers;
    return numbers ? "62" + numbers : numbers;
  };

  const handleWhatsAppChange = (e) => {
    const formatted = formatWhatsApp(e.target.value);
    setForm({ ...form, wa: formatted });
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
            Edit Supplier
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="nama_supplier"
            label="Nama Supplier"
            value={form.nama_supplier}
            onChange={handleChange}
            placeholder="Masukkan nama supplier"
            size="small"
            required
          />

          <TextField
            fullWidth
            name="alamat"
            label="Alamat Supplier"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Masukkan alamat lengkap supplier"
            multiline
            rows={4}
            size="small"
          />

          <TextField
            fullWidth
            name="wa"
            label="Nomor WhatsApp"
            value={form.wa}
            onChange={handleWhatsAppChange}
            placeholder="Contoh: 6281234567890"
            size="small"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsApp sx={{ fontSize: 18, color: SUCCESS_COLOR }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Info Supplier */}
          {/* <Paper
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Supplier
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Supplier:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.supplier_id}</Typography>
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
          </Paper> */}
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

// Komponen Actions Menu dengan Tooltip untuk Supplier
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

  const handleContact = () => {
    if (data.wa) {
      const whatsappUrl = `https://wa.me/${data.wa}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast.error("Nomor WhatsApp tidak tersedia");
    }
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
        
        <MenuItem onClick={handleContact}>
          <ListItemIcon>
            <WhatsApp fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Hubungi</ListItemText>
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

      {/* Delete Dialog untuk Supplier */}
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
            Hapus Supplier
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus supplier{" "}
            <strong>"{data?.nama_supplier}"</strong>?
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
              onDelete(data.supplier_id);
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

export default function AddSupplier() {
  const id_perusahaan = localStorage.getItem("id_perusahaan");
  const id_toko = localStorage.getItem("id_toko");

  const [form, setForm] = useState({
    nama_supplier: "",
    alamat: "",
    wa: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchSuppliers = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/supplier");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data supplier");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_supplier.trim()) {
      toast.error("Nama supplier harus diisi");
      return;
    }
    if (!form.wa.trim()) {
      toast.error("Nomor WhatsApp harus diisi");
      return;
    }

    setLoading(true);
    try {
      await api.post("/supplier", { ...form, id_perusahaan, id_toko });
      toast.success("Supplier berhasil ditambahkan");
      setForm({ nama_supplier: "", alamat: "", wa: "" });
      fetchSuppliers();
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menambah supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      await api.put(`/supplier/${id}`, formData);
      toast.success("Supplier berhasil diupdate");
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupdate supplier");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/supplier/${id}`);
      toast.success("Supplier berhasil dihapus");
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus supplier");
    }
  };

  const resetForm = () => {
    setForm({
      nama_supplier: "",
      alamat: "",
      wa: "",
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
    resetForm();
  };

  const formatWhatsApp = (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.startsWith("0")) return "62" + numbers.slice(1);
    if (numbers.startsWith("62")) return numbers;
    return numbers ? "62" + numbers : numbers;
  };

  const handleWhatsAppChange = (e) => {
    const formatted = formatWhatsApp(e.target.value);
    setForm({ ...form, wa: formatted });
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.nama_supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.wa?.includes(searchTerm)
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                Kelola Supplier
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola data supplier toko Anda
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
        </Box>
      </Fade>

      {/* Table Section */}
      <Box>
        <Fade in timeout={1400}>
          <Box
            sx={{
              borderRadius: 3,
              background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
              overflow: 'hidden',
              mb: 3
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
                📋 Daftar Supplier ({suppliers.length})
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Cari supplier..."
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
                    onClick={fetchSuppliers}
                    size="small"
                    sx={{
                      bgcolor: alpha(GRAY_DARK, 0.1),
                      color: GRAY_DARK,
                      '&:hover': {
                        bgcolor: GRAY_DARK,
                        color: WHITE,
                      }
                    }}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenModal(true)}
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
                  Tambah Supplier
                </Button>
              </Box>
            </Box>

            {loadingList ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
              </Box>
            ) : filteredSuppliers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Person sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                  {searchTerm ? 'Supplier tidak ditemukan' : 'Belum ada data supplier'}
                </Typography>
                <Typography variant="body2" color={GRAY_LIGHT}>
                  {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan supplier pertama Anda'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Supplier</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Alamat</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>WhatsApp</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSuppliers.map((s, index) => (
                      <TableRow 
                        key={s.supplier_id}
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
                            {s.nama_supplier}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16, color: GRAY_MEDIUM }} />
                            <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                              {s.alamat || '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WhatsApp sx={{ fontSize: 16, color: SUCCESS_COLOR }} />
                            <Typography fontSize="0.875rem" color={GRAY_DARK} fontWeight="500">
                              {s.wa}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <ActionsMenu 
                            data={s}
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
            {filteredSuppliers.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 3,
                pt: 2,
                borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
              }}>
                <Typography variant="caption" color={GRAY_MEDIUM}>
                  Menampilkan {filteredSuppliers.length} dari {suppliers.length} supplier
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

      {/* Modal Tambah Supplier */}
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
                Tambah Supplier Baru
              </Typography>
              <Typography variant="body2" color={GRAY_MEDIUM}>
                Isi informasi detail supplier
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
                  name="nama_supplier"
                  label="Nama Supplier"
                  value={form.nama_supplier}
                  onChange={handleChange}
                  placeholder="Masukkan nama supplier"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="alamat"
                  label="Alamat Supplier"
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap supplier"
                  multiline
                  rows={3}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="wa"
                  label="Nomor WhatsApp"
                  value={form.wa}
                  onChange={handleWhatsAppChange}
                  placeholder="Contoh: 6281234567890"
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WhatsApp sx={{ fontSize: 18, color: SUCCESS_COLOR }} />
                      </InputAdornment>
                    ),
                  }}
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
            {loading ? 'Menyimpan...' : 'Simpan Supplier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}