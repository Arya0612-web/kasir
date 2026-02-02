import { useEffect, useState } from "react";
import api from "../../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tabs,
  Tab,
  Modal,
  Stack,
  InputAdornment,
  alpha,
  TablePagination,
  IconButton,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Alert,
  Tooltip,
} from "@mui/material";
import { 
  Search, 
  Refresh, 
  Add, 
  Edit, 
  Delete, 
  Description, 
  MoreVert,
  Close,
  ContentCopy,
  Favorite
} from "@mui/icons-material";
import { toast } from "react-toastify";

// Komponen Edit Drawer
const EditDrawer = ({ open, onClose, data, onSave, title }) => {
  const [uraian, setUraian] = useState("");

  useEffect(() => {
    if (data) {
      setUraian(data.uraian || "");
    }
  }, [data]);

  const handleSubmit = () => {
    if (!uraian.trim()) {
      toast.error("Uraian tidak boleh kosong");
      return;
    }
    console.log("Data yang dikirim ke onSave:", data);
    const idKey = data.id_ket_transaksi || data.id_ket_bayar;
    onSave(idKey, uraian);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 500 },
          background: `linear-gradient(145deg, #ffffff, #f8f9fa)`,
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight="600">
            Edit {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Uraian"
            value={uraian}
            onChange={(e) => setUraian(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder={`Masukkan uraian untuk ${title.toLowerCase()}...`}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
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
              background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
              boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': {
                background: `linear-gradient(45deg, #424242 30%, #616161 90%)`,
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
    const idKey = data.id_ket_transaksi || data.id_ket_bayar;
    onDelete(idKey);

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
          background: `linear-gradient(145deg, #ffffff, #f8f9fa)`,
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Hapus {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Apakah Anda yakin ingin menghapus keterangan{" "}
          <strong>"{data?.uraian}"</strong>?
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

// Komponen Actions Menu
const ActionsMenu = ({ data, title, onEdit, onDelete }) => {
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
        title={title}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        data={data}
        onDelete={onDelete}
        title={title}
      />
    </>
  );
};

export default function KeteranganPage() {
  const [tab, setTab] = useState("bayar");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uraian, setUraian] = useState("");
  const [editId, setEditId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getEndpoint = () => (tab === "bayar" ? "/ket/bayar" : "/ket/transaksi");
  const getTitle = () => (tab === "bayar" ? "Ket Bayar" : "Ket Transaksi");

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get(getEndpoint());
      setData(res.data);
      setFilteredData(res.data);
      toast.success(`Data ${getTitle().toLowerCase()} berhasil dimuat`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Gagal memuat data ${getTitle().toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.uraian?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setPage(0);
  }, [searchTerm, data]);

  useEffect(() => {
    getData();
    setUraian("");
    setEditId(null);
    setSearchTerm("");
    setPage(0);
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uraian.trim()) {
      toast.error("Uraian tidak boleh kosong");
      return;
    }

    try {
      const endpoint = getEndpoint();
      if (editId) {
        await api.put(`${endpoint}/${editId}`, { uraian });
        toast.success("Keterangan berhasil diupdate");
      } else {
        await api.post(endpoint, { uraian });
        toast.success("Keterangan berhasil ditambahkan");
      }
      setOpenModal(false);
      setUraian("");
      setEditId(null);
      getData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan keterangan");
    }
  };

  // Fungsi edit - TIDAK DIUBAH
  const handleEdit = async (id, text) => {
    try {
      const endpoint = getEndpoint();
      await api.put(`${endpoint}/${id}`, { uraian: text });
      toast.success("Keterangan berhasil diupdate");
      getData();
    } catch (error) {
      console.error("Error editing data:", error);
      toast.error("Gagal mengupdate keterangan");
    }
  };


  // Fungsi delete - TIDAK DIUBAH
  const handleDelete = async (id) => {
    try {
      await api.delete(`${getEndpoint()}/${id}`);
      toast.success("Keterangan berhasil dihapus");
      getData();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Gagal menghapus keterangan");
    }
  };

  const handleAddNew = () => {
    setUraian("");
    setEditId(null);
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
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            Kelola Keterangan
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Management uraian untuk {getTitle().toLowerCase()}
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
          Tambah Keterangan
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
            {/* <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Description sx={{ fontSize: 40, color: '#2c2c2c' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total {getTitle()}
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                    {data.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent> */}
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
                <Description sx={{ fontSize: 40, color: '#424242' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Ditampilkan
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#424242">
                    {filteredData.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent> */}
          </Card>
        </Grid>
      </Grid>

      {/* Tab Switch */}
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
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
            }
          }}
        >
          <Tab label="Keterangan Bayar" value="bayar" />
          <Tab label="Keterangan Transaksi" value="transaksi" />
        </Tabs>

        {/* Search and Actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
          <TextField
            fullWidth
            placeholder={`Cari ${getTitle().toLowerCase()}...`}
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
            onClick={getData}
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
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Uraian</TableCell>
                    <TableCell align="center" sx={{ fontWeight: '600', color: '#424242' }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableRow 
                        key={item.id_ket}
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
                          <Typography sx={{ fontWeight: '500' }}>
                            {item.uraian}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <ActionsMenu 
                            data={item}
                            title={getTitle()}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Description sx={{ fontSize: 48, color: '#bdbdbd' }} />
                          <Typography variant="h6" color="text.secondary">
                            Tidak ada data {getTitle().toLowerCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm ? `Tidak ditemukan hasil untuk "${searchTerm}"` : 'Mulai tambah keterangan pertama Anda'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
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

      {/* Modal Add/Edit (untuk tambah data) */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
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
          {editId ? "Edit Keterangan" : "Tambah Keterangan Baru"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Uraian"
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
              fullWidth
              required
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              placeholder={`Masukkan uraian untuk ${getTitle().toLowerCase()}...`}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
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
            variant="contained" 
            onClick={handleSubmit}
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
            {editId ? "Simpan Perubahan" : "Tambah Keterangan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}