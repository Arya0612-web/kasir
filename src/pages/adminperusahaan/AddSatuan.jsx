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
  DialogTitle
} from "@mui/material";
import {
  Save,
  Add,
  Edit,
  Delete,
  Cancel,
  CheckCircle,
  Scale,
  Search,
  Refresh
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

export default function AddSatuan() {
  const [nama, setNama] = useState("");
  const [satuan, setSatuan] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSatuan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/satuan");
      setSatuan(res.data);
    } catch (err) {
      console.error("Gagal fetch satuan:", err);
      setError("Gagal memuat data satuan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatuan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama satuan harus diisi");
      return;
    }

    setLoading(true);
    try {
      await api.post("/satuan", { nama_satuan: nama });
      setSuccess("Satuan berhasil ditambahkan");
      setNama("");
      fetchSatuan();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menambah satuan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/satuan/${id}`);
      setSuccess("Satuan berhasil dihapus");
      setDeleteDialog(null);
      fetchSatuan();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus satuan");
    }
  };

  const handleEdit = (s) => {
    setEditId(s.id_satuan);
    setEditNama(s.nama_satuan);
  };

  const handleUpdate = async (id) => {
    if (!editNama.trim()) {
      setError("Nama satuan tidak boleh kosong");
      return;
    }

    try {
      await api.put(`/satuan/${id}`, { nama_satuan: editNama });
      setSuccess("Satuan berhasil diupdate");
      setEditId(null);
      setEditNama("");
      fetchSatuan();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal update satuan");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditNama("");
    setError("");
  };

  // Filter satuan berdasarkan search term
  const filteredSatuan = satuan.filter(s =>
    s.nama_satuan.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Scale sx={{ fontSize: 32, color: PURPLE }} />
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
                Kelola Satuan
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Tambah dan kelola satuan barang di sistem Anda
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
        {/* Form Section - Lebih Sempit */}
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
                     Tambah Satuan
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Nama Satuan"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: kg, pcs, liter"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Scale sx={{ color: PURPLE, fontSize: 20 }} />
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
                        Total Satuan:
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={PURPLE}>
                        {satuan.length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color={GRAY_MEDIUM}>
                        Unique:
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={PURPLE}>
                        {new Set(satuan.map(s => s.nama_satuan)).size}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Grid>

        {/* Table Section - Lebih Luas */}
        <Grid item xs={12} md={8} lg={9}>
          <Fade in timeout={1400}>
            <Card 
              sx={{
                borderRadius: 3,
                background: WHITE,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Table Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="700" color={BLACK}>
                     Daftar Satuan
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Cari satuan..."
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
                        onClick={fetchSatuan}
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

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} sx={{ color: PURPLE }} />
                  </Box>
                ) : filteredSatuan.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Scale sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                    <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                      {searchTerm ? 'Satuan tidak ditemukan' : 'Belum ada data satuan'}
                    </Typography>
                    <Typography variant="body2" color={GRAY_LIGHT}>
                      {searchTerm ? 'Coba dengan kata kunci lain' : 'Tambahkan satuan pertama Anda'}
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>ID</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>Nama Satuan</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'center', width: 120 }}>Aksi</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredSatuan.map((s) => (
                          <TableRow 
                            key={s.id_satuan}
                            sx={{ 
                              '&:hover': {
                                backgroundColor: alpha(PURPLE, 0.02),
                              }
                            }}
                          >
                            <TableCell>
                              <Chip 
                                label={`#${s.id_satuan}`} 
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
                              {editId === s.id_satuan ? (
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
                                  {s.nama_satuan}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {editId === s.id_satuan ? (
                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                  <Tooltip title="Simpan">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleUpdate(s.id_satuan)}
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
                                      onClick={() => handleEdit(s)}
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
                                      onClick={() => setDeleteDialog(s)}
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
                )}

                {/* Table Footer */}
                {filteredSatuan.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` }}>
                    <Typography variant="caption" color={GRAY_MEDIUM}>
                      Menampilkan {filteredSatuan.length} dari {satuan.length} satuan
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
                )}
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
          Hapus Satuan?
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText>
            Yakin hapus satuan <strong>"{deleteDialog?.nama_satuan}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
            onClick={() => handleDelete(deleteDialog?.id_satuan)}
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
    </Container>
  );
}