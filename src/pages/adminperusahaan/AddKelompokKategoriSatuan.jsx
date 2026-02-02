import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
  Tabs,
  Tab,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  alpha,
  InputAdornment,
  Chip,
  Fade,
  Container,
  Alert,
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  Delete,
  Edit,
  Save,
  Add,
  Cancel,
  CheckCircle,
  Category,
  Scale,
  Search,
  Refresh,
  RestoreFromTrash,
  Archive,
  MoreVert,
  Close,
  ContentCopy,
  Favorite,
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
const WARNING_COLOR = "#ff9800";

// Komponen Edit Drawer untuk Kelompok
const EditKelompokDrawer = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState({
    nama_kelompok: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_kelompok: data.nama_kelompok || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_kelompok.trim()) {
      return;
    }
    onSave(data.id_kelompok, form);
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
            Edit Kelompok
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="nama_kelompok"
            label="Nama Kelompok"
            value={form.nama_kelompok}
            onChange={handleChange}
            placeholder="Masukkan nama kelompok"
            size="small"
            required
          />

          {/* Info Kelompok */}
          <Card
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Kelompok
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Kelompok:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.id_kelompok}</Typography>
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
          </Card>
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

// Komponen Edit Drawer untuk Kategori
const EditKategoriDrawer = ({ open, onClose, data, onSave, kelompokList }) => {
  const [form, setForm] = useState({
    nama_kategori: "",
    kelompok_id: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_kategori: data.nama_kategori || "",
        kelompok_id: data.kelompok_id || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_kategori.trim()) {
      return;
    }
    onSave(data.id_kategori, form);
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
            Edit Kategori
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <FormControl fullWidth size="small">
            <InputLabel>Kelompok</InputLabel>
            <Select
              name="kelompok_id"
              value={form.kelompok_id}
              onChange={handleChange}
              label="Kelompok"
            >
              <MenuItem value="">
                <em>Tidak ada kelompok</em>
              </MenuItem>
              {kelompokList.map((kelompok) => (
                <MenuItem key={kelompok.id_kelompok} value={kelompok.id_kelompok}>
                  {kelompok.nama_kelompok}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="nama_kategori"
            label="Nama Kategori"
            value={form.nama_kategori}
            onChange={handleChange}
            placeholder="Masukkan nama kategori"
            size="small"
            required
          />

          {/* Info Kategori */}
          <Card
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Kategori
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Kategori:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.id_kategori}</Typography>
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
          </Card>
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

// Komponen Edit Drawer untuk Satuan
const EditSatuanDrawer = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState({
    nama_satuan: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        nama_satuan: data.nama_satuan || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_satuan.trim()) {
      return;
    }
    onSave(data.id_satuan, form);
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
            Edit Satuan
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="nama_satuan"
            label="Nama Satuan"
            value={form.nama_satuan}
            onChange={handleChange}
            placeholder="Masukkan nama satuan"
            size="small"
            required
          />

          {/* Info Satuan */}
          <Card
            sx={{
              p: 2,
              bgcolor: alpha(SUCCESS_COLOR, 0.05),
              border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            }}
          >
            <Typography variant="body2" fontWeight="600" color={SUCCESS_COLOR} sx={{ mb: 1 }}>
              ℹ️ Informasi Satuan
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color={GRAY_MEDIUM}>ID Satuan:</Typography>
              <Typography variant="caption" fontWeight="700">{data?.id_satuan}</Typography>
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
          </Card>
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

// Komponen Actions Menu untuk Kelompok
const KelompokActionsMenu = ({ data, onDelete, onEdit }) => {
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
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Hapus</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Drawer */}
      <EditKelompokDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        data={data}
        onSave={onEdit}
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Hapus Kelompok
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus kelompok{" "}
            <strong>"{data?.nama_kelompok}"</strong>?
          </Typography>
          <Alert severity="warning">
            Tindakan ini tidak dapat dibatalkan! Data akan dihapus secara permanen.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              onDelete(data.id_kelompok);
              setDeleteDialogOpen(false);
            }}
            variant="contained"
            color="error"
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Komponen Actions Menu untuk Kategori
const KategoriActionsMenu = ({ data, onDelete, onEdit, kelompokList }) => {
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
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Hapus</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Drawer */}
      <EditKategoriDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        data={data}
        onSave={onEdit}
        kelompokList={kelompokList}
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Hapus Kategori
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus kategori{" "}
            <strong>"{data?.nama_kategori}"</strong>?
          </Typography>
          <Alert severity="warning">
            Tindakan ini tidak dapat dibatalkan! Data akan dihapus secara permanen.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              onDelete(data.id_kategori);
              setDeleteDialogOpen(false);
            }}
            variant="contained"
            color="error"
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Komponen Actions Menu untuk Satuan
const SatuanActionsMenu = ({ data, onDelete, onEdit }) => {
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
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Hapus</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Drawer */}
      <EditSatuanDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        data={data}
        onSave={onEdit}
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Hapus Satuan
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Apakah Anda yakin ingin menghapus satuan{" "}
            <strong>"{data?.nama_satuan}"</strong>?
          </Typography>
          <Alert severity="warning">
            Tindakan ini tidak dapat dibatalkan! Data akan dihapus secara permanen.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              onDelete(data.id_satuan);
              setDeleteDialogOpen(false);
            }}
            variant="contained"
            color="error"
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const AddKelompokKategoriSatuan = ({ idPerusahaan }) => {
  const [tab, setTab] = useState(0);

  // ================== KELOMPOK ==================
  const [kelompok, setKelompok] = useState([]);
  const [namaKelompok, setNamaKelompok] = useState("");
  const [loadingKelompok, setLoadingKelompok] = useState(false);
  const [successKelompok, setSuccessKelompok] = useState("");
  const [errorKelompok, setErrorKelompok] = useState("");
  const [searchTermKelompok, setSearchTermKelompok] = useState("");

  // ================== KATEGORI ==================
  const [kategori, setKategori] = useState([]);
  const [deletedKategori, setDeletedKategori] = useState([]);
  const [namaKategori, setNamaKategori] = useState("");
  const [kelompokId, setKelompokId] = useState("");
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [successKategori, setSuccessKategori] = useState("");
  const [errorKategori, setErrorKategori] = useState("");
  const [searchTermKategori, setSearchTermKategori] = useState("");
  const [activeTabKategori, setActiveTabKategori] = useState(0);

  // ================== SATUAN ==================
  const [satuan, setSatuan] = useState([]);
  const [namaSatuan, setNamaSatuan] = useState("");
  const [loadingSatuan, setLoadingSatuan] = useState(false);
  const [successSatuan, setSuccessSatuan] = useState("");
  const [errorSatuan, setErrorSatuan] = useState("");
  const [searchTermSatuan, setSearchTermSatuan] = useState("");

  axios.defaults.withCredentials = true;

  // ================== FETCH DATA ==================
  const fetchKelompok = async () => {
    setLoadingKelompok(true);
    try {
      const res = await axios.get("http://localhost:5000/api/kelompok", {
        withCredentials: true,
      });
      setKelompok(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil kelompok:", err);
      setErrorKelompok("Gagal memuat data kelompok");
    } finally {
      setLoadingKelompok(false);
    }
  };

  const fetchKategori = async () => {
    setLoadingKategori(true);
    try {
      const res = await axios.get("http://localhost:5000/api/kategori", {
        withCredentials: true,
      });
      setKategori(res.data);
      const resDeleted = await axios.get("http://localhost:5000/api/kategori/deleted", {
        withCredentials: true,
      });
      setDeletedKategori(resDeleted.data);
    } catch (err) {
      console.error("❌ Gagal ambil kategori:", err);
      setErrorKategori("Gagal memuat data kategori");
    } finally {
      setLoadingKategori(false);
    }
  };

  const fetchSatuan = async () => {
    setLoadingSatuan(true);
    try {
      const res = await axios.get("http://localhost:5000/api/satuan", {
        withCredentials: true,
      });
      setSatuan(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil satuan:", err);
      setErrorSatuan("Gagal memuat data satuan");
    } finally {
      setLoadingSatuan(false);
    }
  };

  useEffect(() => {
    fetchKelompok();
    fetchKategori();
    fetchSatuan();
  }, []);

  // ================== HANDLE SUBMIT KELOMPOK ==================
  const handleSubmitKelompok = async (e) => {
    e.preventDefault();
    if (!namaKelompok.trim()) {
      setErrorKelompok("Nama kelompok wajib diisi!");
      return;
    }

    setLoadingKelompok(true);
    try {
      await axios.post(
        "http://localhost:5000/api/kelompok",
        { nama_kelompok: namaKelompok },
        { withCredentials: true }
      );
      setSuccessKelompok("Kelompok berhasil ditambahkan");
      setNamaKelompok("");
      fetchKelompok();
      setTimeout(() => setSuccessKelompok(""), 3000);
    } catch (err) {
      console.error("❌ Gagal simpan kelompok:", err);
      setErrorKelompok(err.response?.data?.message || "Gagal menyimpan kelompok!");
    } finally {
      setLoadingKelompok(false);
    }
  };

  // ================== HANDLE SUBMIT KATEGORI ==================
  const handleSubmitKategori = async (e) => {
    e.preventDefault();
    if (!namaKategori.trim()) {
        setErrorKategori("Nama kategori wajib diisi!");
        return;
    }

    setLoadingKategori(true);
    try {
        await axios.post(
            "http://localhost:5000/api/kategori",
            {
            nama_kategori: namaKategori,
            kelompok_id: kelompokId || null,
            },
            { withCredentials: true }
        );
        setSuccessKategori("Kategori berhasil ditambahkan");
        setNamaKategori("");
        setKelompokId("");
        fetchKategori();
        setTimeout(() => setSuccessKategori(""), 3000);
    } catch (err) {
        console.error("❌ Gagal simpan kategori:", err);
        setErrorKategori("Gagal menyimpan kategori!");
    } finally {
        setLoadingKategori(false);
    }
  };

  // ================== HANDLE SUBMIT SATUAN ==================
  const handleSubmitSatuan = async (e) => {
    e.preventDefault();
    if (!namaSatuan.trim()) {
      setErrorSatuan("Nama satuan harus diisi");
      return;
    }

    setLoadingSatuan(true);
    try {
      await axios.post(
        "http://localhost:5000/api/satuan", 
        { nama_satuan: namaSatuan },
        { withCredentials: true }
      );
      setSuccessSatuan("Satuan berhasil ditambahkan");
      setNamaSatuan("");
      fetchSatuan();
      setTimeout(() => setSuccessSatuan(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorSatuan("Gagal menambah satuan");
    } finally {
      setLoadingSatuan(false);
    }
  };

  // ================== HANDLE EDIT ==================
  const handleEditKelompok = async (id, formData) => {
    try {
      await axios.put(
        `http://localhost:5000/api/kelompok/${id}`,
        formData,
        { withCredentials: true }
      );
      setSuccessKelompok("Kelompok berhasil diupdate");
      fetchKelompok();
      setTimeout(() => setSuccessKelompok(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorKelompok("Gagal mengupdate kelompok");
    }
  };

  const handleEditKategori = async (id, formData) => {
    try {
      await axios.put(
        `http://localhost:5000/api/kategori/${id}`, 
        formData,
        { withCredentials: true }
      );
      setSuccessKategori("Kategori berhasil diupdate");
      fetchKategori();
      setTimeout(() => setSuccessKategori(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorKategori("Gagal update kategori");
    }
  };

  const handleEditSatuan = async (id, formData) => {
    try {
      await axios.put(
        `http://localhost:5000/api/satuan/${id}`, 
        formData,
        { withCredentials: true }
      );
      setSuccessSatuan("Satuan berhasil diupdate");
      fetchSatuan();
      setTimeout(() => setSuccessSatuan(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorSatuan("Gagal update satuan");
    }
  };

  // ================== HANDLE DELETE ==================
  const handleDeleteKelompok = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/kelompok/${id}`, {
        withCredentials: true,
      });
      setSuccessKelompok("Kelompok berhasil dihapus");
      fetchKelompok();
      setTimeout(() => setSuccessKelompok(""), 3000);
    } catch (err) {
      console.error("❌ Gagal hapus kelompok:", err);
      setErrorKelompok("Gagal menghapus kelompok!");
    }
  };

  const handleDeleteKategori = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/kategori/${id}`, {
        withCredentials: true,
      });
      setSuccessKategori("Kategori berhasil dihapus");
      fetchKategori();
      setTimeout(() => setSuccessKategori(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorKategori("Gagal menghapus kategori");
    }
  };

  const handleDeleteSatuan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/satuan/${id}`, {
        withCredentials: true,
      });
      setSuccessSatuan("Satuan berhasil dihapus");
      fetchSatuan();
      setTimeout(() => setSuccessSatuan(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorSatuan("Gagal menghapus satuan");
    }
  };

  const handleRestoreKategori = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/kategori/restore/${id}`, {}, {
        withCredentials: true,
      });
      setSuccessKategori("Kategori berhasil direstore");
      fetchKategori();
      setTimeout(() => setSuccessKategori(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorKategori("Gagal restore kategori");
    }
  };

  // ================== FILTER DATA ==================
  const filteredKelompok = kelompok.filter(k =>
    k.nama_kelompok.toLowerCase().includes(searchTermKelompok.toLowerCase())
  );

  const filteredKategori = kategori.filter(k =>
    k.nama_kategori.toLowerCase().includes(searchTermKategori.toLowerCase())
  );

  const filteredDeletedKategori = deletedKategori.filter(k =>
    k.nama_kategori.toLowerCase().includes(searchTermKategori.toLowerCase())
  );

  const filteredSatuan = satuan.filter(s =>
    s.nama_satuan.toLowerCase().includes(searchTermSatuan.toLowerCase())
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
              <Category sx={{ fontSize: 32, color: GRAY_DARK }} />
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
                Kelola Master Data
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola kelompok, kategori, dan satuan barang di sistem Anda
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
        </Box>
      </Fade>

      {/* Main Tabs */}
      <Tabs 
        value={tab} 
        onChange={(e, newVal) => setTab(newVal)} 
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: '600',
            textTransform: 'none',
            fontSize: '0.875rem',
            minHeight: 48
          }
        }}
      >
        <Tab icon={<Category />} iconPosition="start" label="Kelompok" />
        <Tab icon={<Archive />} iconPosition="start" label="Kategori" />
        <Tab icon={<Scale />} iconPosition="start" label="Satuan" />
      </Tabs>

      {/* ===================== TAB KELOMPOK ===================== */}
      {tab === 0 && (
        <Fade in timeout={500}>
          <Box>
            {/* Table Section */}
            <Card 
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Table Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3,
                  pb: 2
                }}>
                  <Typography variant="h6" fontWeight="700" color={GRAY_DARK}>
                    📋 Daftar Kelompok ({kelompok.length})
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleSubmitKelompok}
                      disabled={loadingKelompok || !namaKelompok.trim()}
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
                      Tambah Kelompok
                    </Button>
                    
                    <TextField
                      size="small"
                      placeholder="Cari kelompok..."
                      value={searchTermKelompok}
                      onChange={(e) => setSearchTermKelompok(e.target.value)}
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
                        onClick={fetchKelompok}
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

                {/* Add Form */}
                <Box sx={{ p: 3, pt: 0, pb: 2 }}>
                  {successKelompok && (
                    <Alert 
                      severity="success"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setSuccessKelompok("")}
                    >
                      {successKelompok}
                    </Alert>
                  )}

                  {errorKelompok && (
                    <Alert 
                      severity="error"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setErrorKelompok("")}
                    >
                      {errorKelompok}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Nama Kelompok"
                      value={namaKelompok}
                      onChange={(e) => setNamaKelompok(e.target.value)}
                      placeholder="Contoh: Elektronik, Fashion"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {loadingKelompok ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
                  </Box>
                ) : filteredKelompok.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Category sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                    <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                      {searchTermKelompok ? 'Kelompok tidak ditemukan' : 'Belum ada data kelompok'}
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                          <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Kelompok</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredKelompok.map((kelompok, index) => (
                          <TableRow 
                            key={kelompok.id_kelompok}
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
                                {kelompok.nama_kelompok}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <KelompokActionsMenu 
                                data={kelompok}
                                onDelete={handleDeleteKelompok}
                                onEdit={handleEditKelompok}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Table Footer */}
                {filteredKelompok.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 3,
                    pt: 2,
                    borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
                  }}>
                    <Typography variant="caption" color={GRAY_MEDIUM}>
                      Menampilkan {filteredKelompok.length} dari {kelompok.length} kelompok
                    </Typography>
                    {searchTermKelompok && (
                      <Chip 
                        label={`Pencarian: "${searchTermKelompok}"`} 
                        size="small" 
                        onDelete={() => setSearchTermKelompok("")}
                        sx={{ 
                          bgcolor: alpha(GRAY_DARK, 0.1), 
                          color: GRAY_DARK,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}

      {/* ===================== TAB KATEGORI ===================== */}
      {tab === 1 && (
        <Fade in timeout={500}>
          <Box>
            {/* Table Section */}
            <Card 
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Table Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3,
                  pb: 2
                }}>
                  <Typography variant="h6" fontWeight="700" color={GRAY_DARK}>
                    📋 Daftar Kategori ({activeTabKategori === 0 ? kategori.length : deletedKategori.length})
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleSubmitKategori}
                      disabled={loadingKategori || !namaKategori.trim()}
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
                      Tambah Kategori
                    </Button>
                    
                    <TextField
                      size="small"
                      placeholder="Cari kategori..."
                      value={searchTermKategori}
                      onChange={(e) => setSearchTermKategori(e.target.value)}
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
                        onClick={fetchKategori}
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

                {/* Add Form */}
                <Box sx={{ p: 3, pt: 0, pb: 2 }}>
                  {successKategori && (
                    <Alert 
                      severity="success"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setSuccessKategori("")}
                    >
                      {successKategori}
                    </Alert>
                  )}

                  {errorKategori && (
                    <Alert 
                      severity="error"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setErrorKategori("")}
                    >
                      {errorKategori}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Kelompok</InputLabel>
                      <Select
                        value={kelompokId}
                        onChange={(e) => setKelompokId(e.target.value)}
                        label="Kelompok"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>Tidak ada kelompok</em>
                        </MenuItem>
                        {kelompok.map((k) => (
                          <MenuItem key={k.id_kelompok} value={k.id_kelompok}>
                            {k.nama_kelompok}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Nama Kategori"
                      value={namaKategori}
                      onChange={(e) => setNamaKategori(e.target.value)}
                      placeholder="Contoh: Laptop, Smartphone"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Tabs Kategori */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                  <Tabs 
                    value={activeTabKategori} 
                    onChange={(e, newValue) => setActiveTabKategori(newValue)}
                    sx={{
                      '& .MuiTab-root': {
                        fontWeight: '600',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        minHeight: 48
                      }
                    }}
                  >
                    <Tab 
                      label={`Kategori Aktif (${kategori.length})`} 
                    />
                    <Tab 
                      label={`Kategori Terhapus (${deletedKategori.length})`} 
                    />
                  </Tabs>
                </Box>

                {loadingKategori ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
                  </Box>
                ) : (
                  <>
                    {/* Kategori Aktif */}
                    {activeTabKategori === 0 && (
                      filteredKategori.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Category sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                          <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                            {searchTermKategori ? 'Kategori tidak ditemukan' : 'Belum ada data kategori'}
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Kategori</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Kelompok</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredKategori.map((kategori, index) => (
                                <TableRow 
                                  key={kategori.id_kategori}
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
                                      {kategori.nama_kategori}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography fontSize="0.875rem" color={GRAY_MEDIUM}>
                                      {kelompok.find(k => k.id_kelompok === kategori.kelompok_id)?.nama_kelompok || "Tidak ada kelompok"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: 'center' }}>
                                    <KategoriActionsMenu 
                                      data={kategori}
                                      onDelete={handleDeleteKategori}
                                      onEdit={handleEditKategori}
                                      kelompokList={kelompok}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )
                    )}

                    {/* Kategori Terhapus */}
                    {activeTabKategori === 1 && (
                      filteredDeletedKategori.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Archive sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                          <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                            {searchTermKategori ? 'Kategori terhapus tidak ditemukan' : 'Tidak ada kategori terhapus'}
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Kategori</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredDeletedKategori.map((kategori, index) => (
                                <TableRow 
                                  key={kategori.id_kategori}
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
                                      {kategori.nama_kategori}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: 'center' }}>
                                    <Tooltip title="Restore">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleRestoreKategori(kategori.id_kategori)}
                                        sx={{
                                          bgcolor: alpha(SUCCESS_COLOR, 0.1),
                                          color: SUCCESS_COLOR,
                                          '&:hover': { bgcolor: SUCCESS_COLOR, color: WHITE }
                                        }}
                                      >
                                        <RestoreFromTrash fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )
                    )}
                  </>
                )}

                {/* Table Footer */}
                {(activeTabKategori === 0 && filteredKategori.length > 0) || (activeTabKategori === 1 && filteredDeletedKategori.length > 0) ? (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 3,
                    pt: 2,
                    borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
                  }}>
                    <Typography variant="caption" color={GRAY_MEDIUM}>
                      Menampilkan {activeTabKategori === 0 ? filteredKategori.length : filteredDeletedKategori.length} item
                    </Typography>
                    {searchTermKategori && (
                      <Chip 
                        label={`Pencarian: "${searchTermKategori}"`} 
                        size="small" 
                        onDelete={() => setSearchTermKategori("")}
                        sx={{ 
                          bgcolor: alpha(GRAY_DARK, 0.1), 
                          color: GRAY_DARK,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}

      {/* ===================== TAB SATUAN ===================== */}
      {tab === 2 && (
        <Fade in timeout={500}>
          <Box>
            {/* Table Section */}
            <Card 
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Table Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3,
                  pb: 2
                }}>
                  <Typography variant="h6" fontWeight="700" color={GRAY_DARK}>
                    📋 Daftar Satuan ({satuan.length})
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleSubmitSatuan}
                      disabled={loadingSatuan || !namaSatuan.trim()}
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
                      Tambah Satuan
                    </Button>
                    
                    <TextField
                      size="small"
                      placeholder="Cari satuan..."
                      value={searchTermSatuan}
                      onChange={(e) => setSearchTermSatuan(e.target.value)}
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
                        onClick={fetchSatuan}
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

                {/* Add Form */}
                <Box sx={{ p: 3, pt: 0, pb: 2 }}>
                  {successSatuan && (
                    <Alert 
                      severity="success"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setSuccessSatuan("")}
                    >
                      {successSatuan}
                    </Alert>
                  )}

                  {errorSatuan && (
                    <Alert 
                      severity="error"
                      sx={{ mb: 2, borderRadius: 2 }}
                      onClose={() => setErrorSatuan("")}
                    >
                      {errorSatuan}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Nama Satuan"
                      value={namaSatuan}
                      onChange={(e) => setNamaSatuan(e.target.value)}
                      placeholder="Contoh: kg, pcs, liter"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Scale sx={{ color: GRAY_MEDIUM, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {loadingSatuan ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
                  </Box>
                ) : filteredSatuan.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Scale sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                    <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                      {searchTermSatuan ? 'Satuan tidak ditemukan' : 'Belum ada data satuan'}
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: alpha(GRAY_DARK, 0.02) }}>
                          <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', width: 60 }}>No</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>Nama Satuan</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredSatuan.map((satuan, index) => (
                          <TableRow 
                            key={satuan.id_satuan}
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
                                {satuan.nama_satuan}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <SatuanActionsMenu 
                                data={satuan}
                                onDelete={handleDeleteSatuan}
                                onEdit={handleEditSatuan}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Table Footer */}
                {filteredSatuan.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 3,
                    pt: 2,
                    borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
                  }}>
                    <Typography variant="caption" color={GRAY_MEDIUM}>
                      Menampilkan {filteredSatuan.length} dari {satuan.length} satuan
                    </Typography>
                    {searchTermSatuan && (
                      <Chip 
                        label={`Pencarian: "${searchTermSatuan}"`} 
                        size="small" 
                        onDelete={() => setSearchTermSatuan("")}
                        sx={{ 
                          bgcolor: alpha(GRAY_DARK, 0.1), 
                          color: GRAY_DARK,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default AddKelompokKategoriSatuan;