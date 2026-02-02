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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Drawer,
  Menu,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Save,
  Add,
  Edit,
  Delete,
  Cancel,
  CheckCircle,
  Inventory,
  Category,
  AttachMoney,
  LocalOffer,
  Scale,
  LocalShipping,
  Search,
  Refresh,
  QrCode,
  MoreVert,
  Close,
  ContentCopy,
  Favorite,
  Warning
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
const WARNING_COLOR = "#ff9800";

// Komponen Edit Drawer
const EditDrawer = ({ open, onClose, data, onSave, title, kategori, satuan, supplier }) => {
  const [form, setForm] = useState({
    barcode: "",
    nama_barang: "",
    kategori_id: "",
    harga_beli: "",
    harga_jual: "",
    diskon: 0,
    satuan_id: "",
    supplier_id: ""
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nama_barang.trim()) {
      toast.error("Nama barang harus diisi");
      return;
    }
    if (!form.harga_jual || parseFloat(form.harga_jual) <= 0) {
      toast.error("Harga jual harus lebih dari 0");
      return;
    }
    onSave(data.id_barang, form);
  };

  const calculateProfit = () => {
    const hargaBeli = parseFloat(form.harga_beli) || 0;
    const hargaJual = parseFloat(form.harga_jual) || 0;
    const diskonPersen = parseFloat(form.diskon) || 0;

    if (hargaBeli > 0 && hargaJual > 0) {
      const nilaiDiskon = (hargaJual * diskonPersen) / 100;
      const profit = hargaJual - nilaiDiskon - hargaBeli;
      const margin = ((profit / hargaBeli) * 100).toFixed(1);
      return { profit, margin };
    }
    return { profit: 0, margin: 0 };
  };

  const { profit, margin } = calculateProfit();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
            Edit Barang
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
          <TextField
            fullWidth
            name="barcode"
            label="Barcode"
            value={form.barcode}
            onChange={handleChange}
            placeholder="Scan atau masukkan barcode"
            size="small"
          />

          <TextField
            fullWidth
            name="nama_barang"
            label="Nama Barang"
            value={form.nama_barang}
            onChange={handleChange}
            placeholder="Masukkan nama barang"
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Kategori</InputLabel>
            <Select
              name="kategori_id"
              value={form.kategori_id}
              onChange={handleChange}
              label="Kategori"
            >
              <MenuItem value="">-- Pilih Kategori --</MenuItem>
              {kategori.map((k) => (
                <MenuItem key={k.id_kategori} value={k.id_kategori}>
                  {k.nama_kategori}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Satuan</InputLabel>
            <Select
              name="satuan_id"
              value={form.satuan_id}
              onChange={handleChange}
              label="Satuan"
            >
              <MenuItem value="">-- Pilih Satuan --</MenuItem>
              {satuan.map((s) => (
                <MenuItem key={s.id_satuan} value={s.id_satuan}>
                  {s.nama_satuan}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="harga_beli"
            label="Harga Beli"
            type="number"
            value={form.harga_beli}
            onChange={handleChange}
            placeholder="0"
            size="small"
          />

          <TextField
            fullWidth
            name="harga_jual"
            label="Harga Jual"
            type="number"
            value={form.harga_jual}
            onChange={handleChange}
            placeholder="0"
            size="small"
          />

          <TextField
            fullWidth
            name="diskon"
            label="Diskon (%)"
            type="number"
            value={form.diskon}
            onChange={handleChange}
            placeholder="0"
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Supplier</InputLabel>
            <Select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              label="Supplier"
            >
              <MenuItem value="">-- Pilih Supplier --</MenuItem>
              {supplier.map((s) => (
                <MenuItem key={s.supplier_id} value={s.supplier_id}>
                  {s.nama_supplier}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Profit Calculator */}
                    {(form.harga_beli && form.harga_jual) && (
                      <Paper
                        sx={{
                          p: 2,
                          mb: 2,
                          bgcolor: alpha(SUCCESS_COLOR, 0.05),
                          border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color={SUCCESS_COLOR}
                          sx={{ mb: 1 }}
                        >
                          💰 Kalkulasi Profit
                        </Typography>

                        {/* Detail perhitungan */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Harga Beli:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {formatCurrency(form.harga_beli)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Harga Jual:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {formatCurrency(form.harga_jual)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Diskon:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {form.diskon}% ({formatCurrency((form.harga_jual * form.diskon) / 100)})
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Harga Setelah Diskon:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {formatCurrency(form.harga_jual - (form.harga_jual * form.diskon) / 100)}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Profit:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={SUCCESS_COLOR}>
                            {formatCurrency(profit)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Margin:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={SUCCESS_COLOR}>
                            {margin}%
                          </Typography>
                        </Box>
                      </Paper>
                    )}
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

// Komponen Delete Dialog
const DeleteDialog = ({ open, onClose, data, onDelete, title }) => {
  const handleConfirmDelete = () => {
    onDelete(data.id_barang);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Hapus Barang
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Apakah Anda yakin ingin menghapus barang{" "}
          <strong>"{data?.nama_barang}"</strong>?
        </Typography>
        <Alert severity="warning">
          Tindakan ini tidak dapat dibatalkan! Data akan dihapus secara permanen.
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
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
          onClick={handleConfirmDelete}
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
  );
};

// Komponen Actions Menu dengan Tooltip
const ActionsMenu = ({ data, onEdit, onDelete, kategori, satuan, supplier }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

      <EditDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        data={data}
        onSave={onEdit}
        title="Barang"
        kategori={kategori}
        satuan={satuan}
        supplier={supplier}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        data={data}
        onDelete={onDelete}
        title="Barang"
      />
    </>
  );
};

export default function AddBarang() {
  const [form, setForm] = useState({
    barcode: "",
    nama_barang: "",
    kategori_id: "",
    harga_beli: "",
    harga_jual: "",
    diskon: 0,
    satuan_id: "",
    supplier_id: ""
  });

  const [kategori, setKategori] = useState([]);
  const [satuan, setSatuan] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [barang, setBarang] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [katRes, satRes, supRes, barRes] = await Promise.all([
        api.get("/kategori"),
        api.get("/satuan"),
        api.get("/supplier"),
        api.get("/barang"),
      ]);
      setKategori(katRes.data);
      setSatuan(satRes.data);
      setSupplier(supRes.data);
      setBarang(barRes.data);
    } catch (err) {
      console.error("Gagal load data master", err);
      setError("Gagal memuat data master");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    
    // Cek duplikasi saat user mengetik
    if (e.target.name === "barcode" || e.target.name === "nama_barang") {
      checkDuplicate(e.target.value, e.target.name);
    }
  };

  // Fungsi untuk cek duplikasi barang
  const checkDuplicate = (value, fieldName) => {
    if (!value.trim()) {
      setDuplicateWarning("");
      return;
    }

    const isDuplicate = barang.some(b => {
      if (fieldName === "barcode" && b.barcode) {
        return b.barcode.toLowerCase() === value.toLowerCase();
      }
      if (fieldName === "nama_barang") {
        return b.nama_barang.toLowerCase() === value.toLowerCase();
      }
      return false;
    });

    if (isDuplicate) {
      const existingBarang = barang.find(b => {
        if (fieldName === "barcode" && b.barcode) {
          return b.barcode.toLowerCase() === value.toLowerCase();
        }
        if (fieldName === "nama_barang") {
          return b.nama_barang.toLowerCase() === value.toLowerCase();
        }
        return false;
      });

      if (fieldName === "barcode") {
        setDuplicateWarning(`⚠️ Barcode "${value}" sudah digunakan oleh barang: ${existingBarang.nama_barang}`);
      } else {
        setDuplicateWarning(`⚠️ Nama barang "${value}" sudah ada dalam daftar`);
      }
    } else {
      setDuplicateWarning("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nama_barang.trim()) {
      toast.error("Nama barang harus diisi");
      return;
    }
    if (!form.harga_jual || parseFloat(form.harga_jual) <= 0) {
      toast.error("Harga jual harus lebih dari 0");
      return;
    }

    // Cek duplikasi sebelum submit
    const isBarcodeDuplicate = form.barcode && barang.some(b => 
      b.barcode && b.barcode.toLowerCase() === form.barcode.toLowerCase()
    );
    
    const isNamaDuplicate = barang.some(b => 
      b.nama_barang.toLowerCase() === form.nama_barang.toLowerCase()
    );

    if (isBarcodeDuplicate || isNamaDuplicate) {
      if (isBarcodeDuplicate) {
        const existingBarang = barang.find(b => 
          b.barcode && b.barcode.toLowerCase() === form.barcode.toLowerCase()
        );
        toast.error(
          <div>
            <strong>Barang sudah ada!</strong>
            <br />
            Barcode <strong>"{form.barcode}"</strong> sudah digunakan oleh:
            <br />
            <strong>"{existingBarang.nama_barang}"</strong>
          </div>,
          { autoClose: 5000 }
        );
      }
      if (isNamaDuplicate) {
        toast.error(
          <div>
            <strong>Barang sudah ada!</strong>
            <br />
            Nama barang <strong>"{form.nama_barang}"</strong> sudah terdaftar.
            <br />
            Gunakan nama yang berbeda.
          </div>,
          { autoClose: 5000 }
        );
      }
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await api.put(`/barang/${editId}`, form);
        toast.success("Barang berhasil diupdate");
      } else {
        await api.post("/barang", form);
        toast.success("Barang berhasil ditambahkan");
      }
      
      resetForm();
      fetchData();
      setOpenModal(false);
    } catch (err) {
      console.error("Error simpan barang:", err.response?.data || err);

      const msg = err.response?.data?.message || "";
      
      // Handle duplicate error dari backend
      if (msg.includes("Barang dengan barcode atau nama yang sama sudah ada")) {
        toast.error(
          <div>
            <strong>Barang sudah ada!</strong>
            <br />
            {form.barcode && `Barcode: "${form.barcode}"`}
            {form.barcode && form.nama_barang && " atau "}
            {`Nama: "${form.nama_barang}"`}
            <br />
            sudah terdaftar dalam sistem.
          </div>,
          { 
            autoClose: 6000,
            icon: <Warning sx={{ color: WARNING_COLOR }} />
          }
        );
      } else {
        toast.error(msg || "Gagal menyimpan barang");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      barcode: "",
      nama_barang: "",
      kategori_id: "",
      harga_beli: "",
      harga_jual: "",
      diskon: 0,
      satuan_id: "",
      supplier_id: ""
    });
    setEditId(null);
    setError("");
    setDuplicateWarning("");
  };

  // Fungsi edit untuk Actions Menu
  const handleEdit = async (id, formData) => {
    try {
      await api.put(`/barang/${id}`, formData);
      toast.success("Barang berhasil diupdate");
      fetchData();
    } catch (err) {
      console.error("Error edit barang:", err);
      const msg = err.response?.data?.message || "";
      if (msg.includes("Barang dengan barcode atau nama yang sama sudah ada")) {
        toast.error(
          <div>
            <strong>Gagal update!</strong>
            <br />
            Barang dengan barcode atau nama yang sama sudah ada.
          </div>,
          { autoClose: 5000 }
        );
      } else {
        toast.error("Gagal mengupdate barang");
      }
    }
  };

  // Fungsi delete untuk Actions Menu
  const handleDelete = async (id) => {
    try {
      await api.delete(`/barang/${id}`);
      toast.success("Barang berhasil dihapus");
      fetchData();
    } catch (err) {
      console.error("Gagal hapus barang", err);
      toast.error("Gagal menghapus barang");
    }
  };

  const handleAddNew = () => {
    resetForm();
    setOpenModal(true);
  };

  const calculateProfit = () => {
    const hargaBeli = parseFloat(form.harga_beli) || 0;
    const hargaJual = parseFloat(form.harga_jual) || 0;
    const diskonPersen = parseFloat(form.diskon) || 0;

    if (hargaBeli > 0 && hargaJual > 0) {
      const nilaiDiskon = (hargaJual * diskonPersen) / 100;
      const profit = hargaJual - nilaiDiskon - hargaBeli;
      const margin = ((profit / hargaBeli) * 100).toFixed(1);
      return { profit, margin };
    }
    return { profit: 0, margin: 0 };
  };

  const { profit, margin } = calculateProfit();

  const filteredBarang = barang.filter(b =>
    b.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
              <Inventory sx={{ fontSize: 32, color: GRAY_DARK }} />
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
                Kelola Barang
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola inventori barang di toko Anda
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
        </Box>
      </Fade>

      {/* Alerts */}
      {success && (
        <Alert 
          severity="success"
          icon={<CheckCircle />}
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
            bgcolor: alpha(SUCCESS_COLOR, 0.05)
          }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert 
          severity="error"
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            border: `1px solid ${alpha(ERROR_COLOR, 0.2)}`
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Hapus Grid container dan ganti dengan div */}
      <div>
        {/* Table Section - Full Width */}
        <div>
          <Fade in timeout={1400}>
            <Box
              sx={{
                borderRadius: 3,
                background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                overflow: 'hidden',
                mb: 1 // margin bottom sebagai pengganti spacing
              }}
            >
              {/* Table Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 3,
                pb: 1
              }}>
                <Typography variant="h6" fontWeight="700" color={GRAY_DARK}>
                  📋 Daftar Barang ({barang.length})
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Cari barang..."
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
                      onClick={fetchData}
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
                    onClick={handleAddNew}
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
                    Tambah Barang
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} sx={{ color: GRAY_DARK }} />
                </Box>
              ) : filteredBarang.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Inventory sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                  <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                    {searchTerm ? 'Barang tidak ditemukan' : 'Belum ada data barang'}
                  </Typography>
                  <Typography variant="body2" color={GRAY_LIGHT}>
                    {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan barang pertama Anda'}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Header Row */}
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr 100px', // Tambah proporsi untuk kolom harga jual
                    gap: 2, // Tambah gap menjadi 2 untuk jarak yang lebih longgar
                    px: 3,
                    py: 2,
                    backgroundColor: alpha(GRAY_DARK, 0.02),
                    borderBottom: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`
                  }}>
                    <Typography sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>
                      Barcode
                    </Typography>
                    <Typography sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>
                      Nama Barang
                    </Typography>
                    <Typography sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem' }}>
                      Kategori
                    </Typography>
                    <Typography sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'right' }}>
                      Harga Jual
                    </Typography>
                    <Typography sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center' }}>
                      Satuan
                    </Typography>
                    <Typography sx={{ fontWeight: '700', color: GRAY_DARK, fontSize: '0.875rem', textAlign: 'center' }}>
                      Aksi
                    </Typography>
                  </Box>

                  {/* Data Rows */}
                  {filteredBarang.map((b, index) => (
                    <Box
                      key={b.id_barang}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr 100px', // Sesuaikan dengan header
                        gap: 2, // Tambah gap menjadi 2
                        px: 3,
                        py: 2,
                        borderBottom: index < filteredBarang.length - 1 ? `1px solid ${alpha(GRAY_LIGHT, 0.2)}` : 'none',
                        '&:hover': {
                          backgroundColor: alpha(GRAY_DARK, 0.02),
                        }
                      }}
                    >
                      {/* Barcode */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={b.barcode || '-'} 
                          size="small" 
                          icon={<QrCode fontSize="small" />}
                          sx={{ 
                            bgcolor: alpha(GRAY_DARK, 0.1), 
                            color: GRAY_DARK,
                            fontWeight: '600',
                            fontSize: '0.75rem'
                          }} 
                        />
                      </Box>

                      {/* Nama Barang */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography fontWeight="500" fontSize="0.875rem" color={GRAY_DARK}>
                          {b.nama_barang}
                        </Typography>
                      </Box>

                      {/* Kategori */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={b.nama_kategori} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: alpha(GRAY_DARK, 0.3),
                            color: GRAY_DARK,
                            fontSize: '0.75rem'
                          }} 
                        />
                      </Box>

                      {/* Harga Jual */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end', 
                        justifyContent: 'center',
                        pr: 2 // Tambah padding right untuk jarak tambahan
                      }}>
                        <Typography fontWeight="600" fontSize="0.875rem" color={SUCCESS_COLOR}>
                          {formatCurrency(b.harga_jual - (b.harga_jual * b.diskon / 100))}
                        </Typography>
                        {b.diskon > 0 && (
                          <Typography variant="caption" color={ERROR_COLOR}>
                            -{formatCurrency((b.harga_jual * b.diskon) / 100)} ({b.diskon}%)
                          </Typography>
                        )}
                      </Box>

                      {/* Satuan */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center', // Center align untuk satuan
                        pl: 2 // Tambah padding left untuk jarak tambahan
                      }}>
                        <Typography fontSize="0.875rem" color={GRAY_MEDIUM} fontWeight="500">
                          {b.nama_satuan}
                        </Typography>
                      </Box>

                      {/* Aksi */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ActionsMenu 
                          data={b}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          kategori={kategori}
                          satuan={satuan}
                          supplier={supplier}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Table Footer */}
              {filteredBarang.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3,
                  pt: 2,
                  borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` 
                }}>
                  <Typography variant="caption" color={GRAY_MEDIUM}>
                    Menampilkan {filteredBarang.length} dari {barang.length} barang
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
      </div>

      {/* Modal Tambah Barang */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
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
        <DialogTitle sx={{ fontWeight: '600', color: GRAY_DARK }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add />
            Tambah Barang Baru
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Duplicate Warning Alert */}
          {duplicateWarning && (
            <Alert 
              severity="warning" 
              icon={<Warning />}
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                border: `1px solid ${alpha(WARNING_COLOR, 0.2)}`,
                bgcolor: alpha(WARNING_COLOR, 0.05)
              }}
            >
              {duplicateWarning}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Baris 1 */}
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <TextField
                  fullWidth
                  name="barcode"
                  label="Barcode"
                  value={form.barcode}
                  onChange={handleChange}
                  placeholder="Scan barcode"
                  size="small"
                  error={!!duplicateWarning && duplicateWarning.includes("Barcode")}
                  helperText={duplicateWarning && duplicateWarning.includes("Barcode") ? "Barcode sudah digunakan" : ""}
                />
              </div>
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <TextField
                  fullWidth
                  name="nama_barang"
                  label="Nama Barang"
                  value={form.nama_barang}
                  onChange={handleChange}
                  placeholder="Nama barang"
                  size="small"
                  error={!!duplicateWarning && duplicateWarning.includes("Nama barang")}
                  helperText={duplicateWarning && duplicateWarning.includes("Nama barang") ? "Nama barang sudah ada" : ""}
                />
              </div>
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    name="kategori_id"
                    value={form.kategori_id}
                    onChange={handleChange}
                    label="Kategori"
                  >
                    <MenuItem value="">-- Pilih Kategori --</MenuItem>
                    {kategori.map((k) => (
                      <MenuItem key={k.id_kategori} value={k.id_kategori}>
                        {k.nama_kategori}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Satuan</InputLabel>
                  <Select
                    name="satuan_id"
                    value={form.satuan_id}
                    onChange={handleChange}
                    label="Satuan"
                  >
                    <MenuItem value="">-- Pilih Satuan --</MenuItem>
                    {satuan.map((s) => (
                      <MenuItem key={s.id_satuan} value={s.id_satuan}>
                        {s.nama_satuan}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Baris 2 */}
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <TextField
                  fullWidth
                  name="harga_beli"
                  label="Harga Beli"
                  type="number"
                  value={form.harga_beli}
                  onChange={handleChange}
                  placeholder="0"
                  size="small"
                />
              </div>
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <TextField
                  fullWidth
                  name="harga_jual"
                  label="Harga Jual"
                  type="number"
                  value={form.harga_jual}
                  onChange={handleChange}
                  placeholder="0"
                  size="small"
                />
              </div>
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <TextField
                  fullWidth
                  name="diskon"
                  label="Diskon (%)"
                  type="number"
                  value={form.diskon}
                  onChange={handleChange}
                  placeholder="0"
                  size="small"
                />
              </div>
              <div style={{ flex: "1 1 calc(25% - 16px)" }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    name="supplier_id"
                    value={form.supplier_id}
                    onChange={handleChange}
                    label="Supplier"
                  >
                    <MenuItem value="">-- Pilih Supplier --</MenuItem>
                    {supplier.map((s) => (
                      <MenuItem key={s.supplier_id} value={s.supplier_id}>
                        {s.nama_supplier}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Profit Calculator */}
                    {(form.harga_beli && form.harga_jual) && (
                      <Paper
                        sx={{
                          p: 2,
                          mb: 2,
                          bgcolor: alpha(SUCCESS_COLOR, 0.05),
                          border: `1px solid ${alpha(SUCCESS_COLOR, 0.2)}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color={SUCCESS_COLOR}
                          sx={{ mb: 1 }}
                        >
                          💰 Kalkulasi Profit
                        </Typography>

                        {/* Detail perhitungan */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Harga Beli:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {formatCurrency(form.harga_beli)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Harga Jual:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {formatCurrency(form.harga_jual)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Diskon:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {form.diskon}% ({formatCurrency((form.harga_jual * form.diskon) / 100)})
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Harga Setelah Diskon:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={BLACK}>
                            {formatCurrency(form.harga_jual - (form.harga_jual * form.diskon) / 100)}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Profit:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={SUCCESS_COLOR}>
                            {formatCurrency(profit)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                          <Typography variant="caption" color={GRAY_MEDIUM}>
                            Margin:
                          </Typography>
                          <Typography variant="caption" fontWeight="700" color={SUCCESS_COLOR}>
                            {margin}%
                          </Typography>
                        </Box>
                      </Paper>
                    )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setOpenModal(false)}
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
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !!duplicateWarning}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: '600',
              background: duplicateWarning 
                ? alpha(GRAY_LIGHT, 0.5)
                : `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
              boxShadow: duplicateWarning ? 'none' : '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': duplicateWarning ? {} : {
                background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
              },
              '&:disabled': {
                background: GRAY_LIGHT,
                color: WHITE,
              }
            }}
          >
            {loading ? 'Menyimpan...' : editId ? 'Update Barang' : 'Simpan Barang'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Empty State Guidance */}
      {barang.length === 0 && !loading && (
        <Fade in timeout={2000}>
          <Paper
            sx={{
              p: 4,
              mt: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(145deg, ${WHITE}, ${GRAY_BACKGROUND})`,
              border: `2px dashed ${alpha(GRAY_LIGHT, 0.5)}`,
            }}
          >
            <Inventory sx={{ fontSize: 64, color: alpha(GRAY_LIGHT, 0.7), mb: 2 }} />
            <Typography variant="h5" fontWeight="600" color={GRAY_DARK} sx={{ mb: 1 }}>
              Mulai Kelola Inventori Anda
            </Typography>
            <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Tambahkan barang pertama Anda untuk mulai mengelola inventori toko. 
              Anda dapat menambahkan barcode, harga, kategori, dan informasi penting lainnya.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleAddNew}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: '600',
                textTransform: 'none',
                fontSize: '1.1rem',
                background: `linear-gradient(45deg, ${GRAY_DARK} 30%, ${GRAY_MEDIUM} 90%)`,
                boxShadow: '0 4px 8px 2px rgba(97, 97, 97, .3)',
                '&:hover': {
                  background: `linear-gradient(45deg, ${GRAY_MEDIUM} 30%, ${GRAY_LIGHT} 90%)`,
                  boxShadow: '0 6px 12px 2px rgba(97, 97, 97, .4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Tambah Barang Pertama
            </Button>
          </Paper>
        </Fade>
      )}
    </Container>
  );
}