import { useEffect, useState } from "react";
import api from "../../api";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination,
  InputAdornment,
  alpha,
  Card,
  CardContent,
  Grid,
  Chip,
  TableContainer
} from "@mui/material";
import { Edit, Delete, Search, Refresh, Person, Group, Store, Security } from "@mui/icons-material";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (pageNum = page, keyword = search) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/users?page=${pageNum + 1}&limit=${rowsPerPage}&search=${keyword}`
      );
      setUsers(res.data.data);
      setTotalUsers(res.data.pagination.total);
    } catch (err) {
      console.error("Gagal memuat data user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLevels = async () => {
    try {
      const res = await api.get("/users/levels");
      setLevels(res.data);
    } catch (err) {
      console.error("Gagal memuat data level:", err);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
    fetchLevels();
  }, [page, rowsPerPage, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editUser.id_user}`, editUser);
      setOpenEdit(false);
      fetchUsers();
    } catch (err) {
      console.error("Gagal update user:", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getLevelColor = (levelName) => {
    switch (levelName?.toLowerCase()) {
      case 'super admin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'kasir':
        return 'info';
      case 'gudang':
        return 'success';
      default:
        return 'default';
    }
  };

  const countUsersByLevel = () => {
    const counts = {};
    users.forEach(user => {
      const level = user.nama_level;
      counts[level] = (counts[level] || 0) + 1;
    });
    return counts;
  };

  const levelCounts = countUsersByLevel();

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
            Manajemen Pengguna
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola akses dan data pengguna sistem
          </Typography>
        </Box>
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
                <Person sx={{ fontSize: 40, color: '#2c2c2c' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Pengguna
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                    {totalUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* <Grid item xs={12} sm={6} md={3}>
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
                <Security sx={{ fontSize: 40, color: '#424242' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Super Admin
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#424242">
                    {levelCounts['Super Admin'] || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
        
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
                <Group sx={{ fontSize: 40, color: '#616161' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Admin/Kasir
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#616161">
                    {(levelCounts['Admin'] || 0) + (levelCounts['Kasir'] || 0)}
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
                <Store sx={{ fontSize: 40, color: '#757575' }} />
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Dengan Toko
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#757575">
                    {users.filter(u => u.nama_toko).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
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
            placeholder="Cari pengguna berdasarkan nama, username, atau toko..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
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
          
          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={() => fetchUsers()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: '600',
              textTransform: 'none',
              color: '#424242',
              borderColor: '#9e9e9e',
              '&:hover': {
                borderColor: '#616161',
                backgroundColor: alpha('#616161', 0.05),
              },
            }}
          >
            Cari
          </Button>
          
          <IconButton
            onClick={() => fetchUsers()}
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
            <CircularProgress sx={{ color: '#616161' }} />
          </Box>
        ) : users.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>No</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Nama Pengguna</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Level</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Toko</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u, i) => (
                    <TableRow 
                      key={u.id_user}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: alpha('#f5f5f5', 0.5),
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: '500' }}>
                        {page * rowsPerPage + i + 1}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 20, color: '#9e9e9e' }} />
                          <Typography variant="body1" fontWeight="500">
                            {u.nama_user}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{u.username}</TableCell>
                      <TableCell>
                        <Chip 
                          label={u.nama_level} 
                          size="small" 
                          color={getLevelColor(u.nama_level)}
                          variant="outlined"
                          sx={{ fontWeight: '600' }}
                        />
                      </TableCell>
                      <TableCell>
                        {u.nama_toko ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Store sx={{ fontSize: 16, color: '#9e9e9e' }} />
                            <Typography variant="body2">
                              {u.nama_toko}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(u)}
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
                            onClick={() => handleDelete(u.id_user)}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Baris per halaman:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
              }
              sx={{
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: '500',
                }
              }}
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column' }}>
            <Group sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tidak ada pengguna ditemukan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search ? `Tidak ditemukan hasil untuk "${search}"` : 'Data pengguna akan muncul di sini'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Modal Edit */}
      <Dialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
            boxShadow: '20px 20px 40px #d9d9d9, -20px -20px 40px #ffffff',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '600', color: '#2c2c2c' }}>
          Edit Pengguna
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Pengguna"
            fullWidth
            value={editUser?.nama_user || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, nama_user: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={editUser?.username || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, username: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Level</InputLabel>
            <Select
              value={editUser?.id_level || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, id_level: e.target.value })
              }
              label="Level"
            >
              {levels.map((lvl) => (
                <MenuItem key={lvl.id_level} value={lvl.id_level}>
                  {lvl.nama_level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setOpenEdit(false)}
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
            onClick={handleUpdate}
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
            Simpan Perubahan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}