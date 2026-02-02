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
  Store,
  LocationOn,
  Phone,
  Person,
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

// Komponen Edit Drawer untuk Toko
const EditDrawer = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState({
    nama_toko: "",
    alamat_toko: "",
    no_wa_toko: "",
    kepala_toko: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_toko: data.nama_toko || "",
        alamat_toko: data.alamat_toko || "",
        no_wa_toko: data.no_wa_toko || "",
        kepala_toko: data.kepala_toko || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_toko.trim()) {
      toast.error("Nama toko harus diisi");
      return;
    }
    if (!form.alamat_toko.trim()) {
      toast.error("Alamat toko harus diisi");
      return;
    }
    if (!form.kepala_toko.trim()) {
      toast.error("Nama kepala toko harus diisi");
      return;
    }
    onSave(data.id_toko, form);
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
            Edit Toko
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="nama_toko"
            label="Nama Toko"
            value={form.nama_toko}
            onChange={handleChange}
            placeholder="Masukkan nama toko"
            size="small"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Store sx={{ color: GRAY_MEDIUM }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="alamat_toko"
            label="Alamat Toko"
            value={form.alamat_toko}
            onChange={handleChange}
            placeholder="Masukkan alamat toko"
            multiline
            rows={3}
            size="small"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn sx={{ color: GRAY_MEDIUM, mt: '8px', alignSelf: 'flex-start' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="no_wa_toko"
            label="Nomor WhatsApp Toko"
            value={form.no_wa_toko}
            onChange={handleChange}
            placeholder="Masukkan nomor WhatsApp"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: GRAY_MEDIUM }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="kepala_toko"
            label="Nama Kepala Toko"
            value={form.kepala_toko}
            onChange={handleChange}
            placeholder="Masukkan nama kepala toko"
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

          {/* Info Toko */}
          <Paper
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Toko
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Toko:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.id_toko}</Typography>
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

// Komponen Actions Menu dengan Tooltip untuk Toko
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

      {/* Delete Dialog untuk Toko */}
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
            Hapus Toko
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus toko{" "}
            <strong>"{data?.nama_toko}"</strong>?
          </Typography>
          <Typography variant="body2" color={GRAY_MEDIUM} sx={{ mb: 2 }}>
            Alamat: {data?.alamat_toko}
          </Typography>
          <Alert severity="warning">
            Tindakan ini tidak dapat dibatalkan! Data toko dan semua admin yang terkait akan dihapus secara permanen.
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
              onDelete(data.id_toko);
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

export default function AddToko() {
  const [form, setForm] = useState({
    nama_toko: "",
    alamat_toko: "",
    no_wa_toko: "",
    kepala_toko: ""
  });
  const [tokoList, setTokoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil daftar toko
  useEffect(() => {
    const fetchToko = async () => {
      setLoadingList(true);
      try {
        const res = await api.get("/toko");
        setTokoList(res.data);
      } catch (err) {
        console.error("Gagal ambil toko:", err);
        toast.error("Gagal memuat data toko");
      } finally {
        setLoadingList(false);
      }
    };
    fetchToko();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_toko.trim()) {
      toast.error("Nama toko harus diisi");
      return;
    }
    if (!form.alamat_toko.trim()) {
      toast.error("Alamat toko harus diisi");
      return;
    }
    if (!form.kepala_toko.trim()) {
      toast.error("Nama kepala toko harus diisi");
      return;
    }

    setLoading(true);
    try {
      await api.post("/toko", form);
      toast.success("Toko berhasil ditambahkan");
      resetForm();
      setOpenModal(false);
      
      // Refresh daftar toko
      const res = await api.get("/toko");
      setTokoList(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Gagal menambah toko");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      await api.put(`/toko/${id}`, formData);
      toast.success("Toko berhasil diupdate");
      
      // Refresh daftar toko
      const res = await api.get("/toko");
      setTokoList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupdate toko");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/toko/${id}`);
      toast.success("Toko berhasil dihapus");
      
      // Refresh daftar toko
      const res = await api.get("/toko");
      setTokoList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus toko");
    }
  };

  const resetForm = () => {
    setForm({
      nama_toko: "",
      alamat_toko: "",
      no_wa_toko: "",
      kepala_toko: ""
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
    resetForm();
  };

  const refreshTokoList = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/toko");
      setTokoList(res.data);
    } catch (err) {
      toast.error("Gagal memuat data toko");
    } finally {
      setLoadingList(false);
    }
  };

  const filteredToko = tokoList.filter(toko =>
    toko.nama_toko.toLowerCase().includes(searchTerm.toLowerCase()) ||
    toko.alamat_toko.toLowerCase().includes(searchTerm.toLowerCase()) ||
    toko.kepala_toko.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Store sx={{ fontSize: 32, color: GRAY_DARK }} />
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
                Kelola Toko
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola data toko Anda
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
        </Box>
      </Fade>

      {/* Table Section */}
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
              📋 Daftar Toko ({tokoList.length})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenModal(true)}
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
                }}
              >
                Tambah Toko Baru
              </Button>
              
              <TextField
                size="small"
                placeholder="Cari toko..."
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
                  onClick={refreshTokoList}
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
          ) : filteredToko.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Store sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
              <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                {searchTerm ? 'Toko tidak ditemukan' : 'Belum ada data toko'}
              </Typography>
              <Typography variant="body2" color={GRAY_LIGHT}>
                {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan toko pertama Anda'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                    <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                    <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Toko</TableCell>
                    <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Alamat</TableCell>
                    <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>No. WhatsApp</TableCell>
                    <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Kepala Toko</TableCell>
                    <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredToko.map((toko, index) => (
                    <TableRow 
                      key={toko.id_toko}
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
                          {toko.nama_toko}
                        </Typography>
                        
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                          {toko.alamat_toko}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                          {toko.no_wa_toko || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                          {toko.kepala_toko}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <ActionsMenu 
                          data={toko}
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
          {filteredToko.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 3,
              pt: 2,
              borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
            }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>
                Menampilkan {filteredToko.length} dari {tokoList.length} toko
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

      {/* Modal Tambah Toko */}
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
                Tambah Toko Baru
              </Typography>
              <Typography variant="body2" color={GRAY_MEDIUM}>
                Isi informasi detail toko
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="nama_toko"
              label="Nama Toko"
              value={form.nama_toko}
              onChange={handleChange}
              placeholder="Masukkan nama toko"
              size="small"
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Store sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="alamat_toko"
              label="Alamat Toko"
              value={form.alamat_toko}
              onChange={handleChange}
              placeholder="Masukkan alamat toko"
              multiline
              rows={3}
              size="small"
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ fontSize: 18, color: GRAY_MEDIUM, mt: '8px', alignSelf: 'flex-start' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="no_wa_toko"
              label="Nomor WhatsApp Toko"
              value={form.no_wa_toko}
              onChange={handleChange}
              placeholder="Masukkan nomor WhatsApp"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ fontSize: 18, color: GRAY_MEDIUM }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="kepala_toko"
              label="Nama Kepala Toko"
              value={form.kepala_toko}
              onChange={handleChange}
              placeholder="Masukkan nama kepala toko"
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
            {loading ? 'Menyimpan...' : 'Simpan Toko'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}