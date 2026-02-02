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
  Tab,
  Tabs
} from "@mui/material";
import {
  Save,
  Add,
  Edit,
  Delete,
  Cancel,
  CheckCircle,
  Category,
  Search,
  Refresh,
  RestoreFromTrash,
  Archive
} from "@mui/icons-material";
import api from "../../api";

// Warna palette
const BLACK = "#000000";
const WHITE = "#ffffff";
const GRAY_DARK = "#424242";
const GRAY_MEDIUM = "#757575";
const GRAY_LIGHT = "#bdbdbd";
const PURPLE = "#9588e8";
const PURPLE_LIGHT = alpha("#9588e8", 0.1);
const PURPLE_DARK = "#7a6de5";
const SUCCESS_COLOR = "#4caf50";
const ERROR_COLOR = "#f44336";
const WARNING_COLOR = "#ff9800";

export default function AddKategori() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [deletedKategori, setDeletedKategori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [restoreDialog, setRestoreDialog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const fetchKategori = async () => {
    setLoading(true);
    try {
      const res = await api.get("/kategori");
      setKategori(res.data);
      const resDeleted = await api.get("/kategori/deleted");
      setDeletedKategori(resDeleted.data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
      setError("Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama kategori harus diisi");
      return;
    }

    setLoading(true);
    try {
      await api.post("/kategori", { nama_kategori: nama });
      setSuccess("Kategori berhasil ditambahkan");
      setNama("");
      fetchKategori();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/kategori/${id}`);
      setSuccess("Kategori berhasil dihapus");
      setDeleteDialog(null);
      fetchKategori();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus kategori");
    }
  };

  const handleEdit = (k) => {
    setEditId(k.id_kategori);
    setEditNama(k.nama_kategori);
  };

  const handleUpdate = async (id) => {
    if (!editNama.trim()) {
      setError("Nama kategori tidak boleh kosong");
      return;
    }

    try {
      await api.put(`/kategori/${id}`, { nama_kategori: editNama });
      setSuccess("Kategori berhasil diupdate");
      setEditId(null);
      setEditNama("");
      fetchKategori();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal update kategori");
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.put(`/kategori/restore/${id}`);
      setSuccess("Kategori berhasil direstore");
      setRestoreDialog(null);
      fetchKategori();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal restore kategori");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditNama("");
    setError("");
  };

  // Filter kategori berdasarkan search term
  const filteredKategori = kategori.filter(k =>
    k.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedKategori = deletedKategori.filter(k =>
    k.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                backgroundColor: PURPLE_LIGHT,
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Category sx={{ fontSize: 32, color: PURPLE }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="800"
                sx={{
                  color: BLACK,
                  background: `linear-gradient(45deg, ${BLACK} 30%, ${PURPLE} 90%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Kelola Kategori
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Tambah dan kelola kategori barang di sistem Anda
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

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={4} lg={3}>
          <Fade in timeout={1200}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Card 
                sx={{
                  borderRadius: 3,
                  background: WHITE,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" color={BLACK} sx={{ mb: 2 }}>
                     Tambah Kategori
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Nama Kategori"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Elektronik, Fashion"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Category sx={{ color: PURPLE, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: PURPLE,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: PURPLE,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: PURPLE,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={
                        loading ? 
                          <CircularProgress size={16} sx={{ color: WHITE }} /> : 
                          <Add />
                      }
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        bgcolor: PURPLE,
                        '&:hover': {
                          bgcolor: PURPLE_DARK,
                          boxShadow: `0 4px 12px ${alpha(PURPLE, 0.3)}`,
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {loading ? 'Menambah...' : 'Tambah'}
                    </Button>
                  </Box>

                  {/* Quick Stats */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: PURPLE_LIGHT, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color={GRAY_MEDIUM}>
                        Total Kategori:
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={PURPLE}>
                        {kategori.length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color={GRAY_MEDIUM}>
                        Terhapus:
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={WARNING_COLOR}>
                        {deletedKategori.length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color={GRAY_MEDIUM}>
                        Total:
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={BLACK}>
                        {kategori.length + deletedKategori.length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Grid>

        {/* Table Section */}
        <Grid item xs={12} md={8} lg={9}>
          <Fade in timeout={1400}>
            <Card 
              sx={{
                borderRadius: 3,
                background: WHITE,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
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
                      icon={<Category />} 
                      iconPosition="start"
                      label={`Kategori Aktif (${kategori.length})`} 
                    />
                    <Tab 
                      icon={<Archive />} 
                      iconPosition="start"
                      label={`Kategori Terhapus (${deletedKategori.length})`} 
                    />
                  </Tabs>
                </Box>

                {/* Table Header */}
                <Box sx={{ p: 3, pb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="700" color={BLACK}>
                      {activeTab === 0 ? ' Daftar Kategori ' : ' Kategori Terhapus'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        size="small"
                        placeholder="Cari kategori..."
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
                          width: 200,
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
                            bgcolor: PURPLE_LIGHT,
                            color: PURPLE,
                            '&:hover': {
                              bgcolor: PURPLE,
                              color: WHITE,
                            }
                          }}
                        >
                          <Refresh fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={32} sx={{ color: PURPLE }} />
                  </Box>
                ) : (
                  <>
                    {/* Kategori Aktif */}
                    {activeTab === 0 && (
                      filteredKategori.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Category sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                          <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                            {searchTerm ? 'Kategori tidak ditemukan' : 'Belum ada data kategori'}
                          </Typography>
                          <Typography variant="body2" color={GRAY_LIGHT}>
                            {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan kategori pertama Anda'}
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>Nama Kategori</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'center', width: 120 }}>Aksi</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredKategori.map((k) => (
                                <TableRow 
                                  key={k.id_kategori}
                                  sx={{ 
                                    '&:hover': {
                                      backgroundColor: alpha(PURPLE, 0.02),
                                    }
                                  }}
                                >
                                  <TableCell>
                                    <Chip 
                                      label={`#${k.id_kategori}`} 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: PURPLE_LIGHT, 
                                        color: PURPLE,
                                        fontWeight: '600',
                                        fontSize: '0.75rem'
                                      }} 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {editId === k.id_kategori ? (
                                      <TextField
                                        size="small"
                                        value={editNama}
                                        onChange={(e) => setEditNama(e.target.value)}
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            fontSize: '0.875rem'
                                          },
                                        }}
                                      />
                                    ) : (
                                      <Typography fontWeight="500" fontSize="0.875rem">
                                        {k.nama_kategori}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: 'center' }}>
                                    {editId === k.id_kategori ? (
                                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                        <Tooltip title="Simpan">
                                          <IconButton
                                            size="small"
                                            onClick={() => handleUpdate(k.id_kategori)}
                                            sx={{
                                              bgcolor: alpha(SUCCESS_COLOR, 0.1),
                                              color: SUCCESS_COLOR,
                                              '&:hover': {
                                                bgcolor: SUCCESS_COLOR,
                                                color: WHITE,
                                              }
                                            }}
                                          >
                                            <CheckCircle fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Batal">
                                          <IconButton
                                            size="small"
                                            onClick={cancelEdit}
                                            sx={{
                                              bgcolor: alpha(ERROR_COLOR, 0.1),
                                              color: ERROR_COLOR,
                                              '&:hover': {
                                                bgcolor: ERROR_COLOR,
                                                color: WHITE,
                                              }
                                            }}
                                          >
                                            <Cancel fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    ) : (
                                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                        <Tooltip title="Edit">
                                          <IconButton
                                            size="small"
                                            onClick={() => handleEdit(k)}
                                            sx={{
                                              bgcolor: alpha(PURPLE, 0.1),
                                              color: PURPLE,
                                              '&:hover': {
                                                bgcolor: PURPLE,
                                                color: WHITE,
                                              }
                                            }}
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Hapus">
                                          <IconButton
                                            size="small"
                                            onClick={() => setDeleteDialog(k)}
                                            sx={{
                                              bgcolor: alpha(ERROR_COLOR, 0.1),
                                              color: ERROR_COLOR,
                                              '&:hover': {
                                                bgcolor: ERROR_COLOR,
                                                color: WHITE,
                                              }
                                            }}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )
                    )}

                    {/* Kategori Terhapus */}
                    {activeTab === 1 && (
                      filteredDeletedKategori.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Archive sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                          <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                            {searchTerm ? 'Kategori terhapus tidak ditemukan' : 'Tidak ada kategori terhapus'}
                          </Typography>
                          <Typography variant="body2" color={GRAY_LIGHT}>
                            {searchTerm ? 'Coba dengan kata kunci lain' : 'Semua kategori saat ini aktif'}
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>Nama Kategori</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'center', width: 100 }}>Aksi</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredDeletedKategori.map((k) => (
                                <TableRow 
                                  key={k.id_kategori}
                                  sx={{ 
                                    '&:hover': {
                                      backgroundColor: alpha(WARNING_COLOR, 0.02),
                                    }
                                  }}
                                >
                                  <TableCell>
                                    <Chip 
                                      label={`#${k.id_kategori}`} 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: alpha(WARNING_COLOR, 0.1), 
                                        color: WARNING_COLOR,
                                        fontWeight: '600',
                                        fontSize: '0.75rem'
                                      }} 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography fontWeight="500" fontSize="0.875rem" color={GRAY_MEDIUM}>
                                      {k.nama_kategori}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: 'center' }}>
                                    <Tooltip title="Restore">
                                      <IconButton
                                        size="small"
                                        onClick={() => setRestoreDialog(k)}
                                        sx={{
                                          bgcolor: alpha(SUCCESS_COLOR, 0.1),
                                          color: SUCCESS_COLOR,
                                          '&:hover': {
                                            bgcolor: SUCCESS_COLOR,
                                            color: WHITE,
                                          }
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
                {(activeTab === 0 && filteredKategori.length > 0) || (activeTab === 1 && filteredDeletedKategori.length > 0) ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, p: 2, borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` }}>
                    <Typography variant="caption" color={GRAY_MEDIUM}>
                      Menampilkan {activeTab === 0 ? filteredKategori.length : filteredDeletedKategori.length} item
                    </Typography>
                    {searchTerm && (
                      <Chip 
                        label={`Pencarian: "${searchTerm}"`} 
                        size="small" 
                        onDelete={() => setSearchTerm("")}
                        sx={{ 
                          bgcolor: PURPLE_LIGHT, 
                          color: PURPLE,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          Hapus Kategori?
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText>
            Yakin hapus kategori <strong>"{deleteDialog?.nama_kategori}"</strong>? Kategori akan dipindah ke arsip dan dapat direstore nanti.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog(null)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Batal
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog?.id_kategori)}
            variant="contained"
            color="error"
            size="small"
            startIcon={<Delete />}
            sx={{ borderRadius: 1 }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog
        open={!!restoreDialog}
        onClose={() => setRestoreDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          Restore Kategori?
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText>
            Restore kategori <strong>"{restoreDialog?.nama_kategori}"</strong>? Kategori akan kembali aktif.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setRestoreDialog(null)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Batal
          </Button>
          <Button
            onClick={() => handleRestore(restoreDialog?.id_kategori)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<RestoreFromTrash />}
            sx={{ borderRadius: 1 }}
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}