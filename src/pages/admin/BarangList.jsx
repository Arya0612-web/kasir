import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  alpha,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Refresh,
  Add,
  Inventory,
  QrCode,
  Category,
  TrendingUp,
  LocalOffer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '/src/api';

export default function BarangList() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/barang/toko?search=${encodeURIComponent(q)}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data barang');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (stok) => {
    if (stok === 0) return { label: 'Habis', color: 'error' };
    if (stok < 5) return { label: 'Sedikit', color: 'warning' };
    return { label: 'Tersedia', color: 'success' };
  };

  const calculateProfitMargin = (hargaBeli, hargaJual) => {
    if (!hargaBeli || !hargaJual || hargaBeli === 0) return 0;
    return ((hargaJual - hargaBeli) / hargaBeli) * 100;
  };

  const getProfitColor = (margin) => {
    if (margin > 50) return '#2e7d32'; // Green for high profit
    if (margin > 20) return '#ed6c02'; // Orange for medium profit
    return '#d32f2f'; // Red for low profit
  };

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
            Daftar Barang Toko
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola inventori barang toko Anda
          </Typography>
        </Box>
        
        {/* <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/barang/tambah')}
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
          Tambah Barang
        </Button> */}
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Barang
              </Typography>
              <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                {data.length}
              </Typography>
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nilai Inventori
              </Typography>
              <Typography variant="h4" fontWeight="700" color="#424242">
                {formatCurrency(data.reduce((sum, item) => sum + (item.stok * item.harga_jual || 0), 0))}
              </Typography>
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Rata-rata Margin
              </Typography>
              <Typography variant="h4" fontWeight="700" color="#616161">
                {data.length > 0 
                  ? `${Math.round(data.reduce((sum, item) => sum + calculateProfitMargin(item.harga_beli, item.harga_jual), 0) / data.length)}%`
                  : '0%'
                }
              </Typography>
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Barang Diskon
              </Typography>
              <Typography variant="h4" fontWeight="700" color="#757575">
                {data.filter(item => item.diskon > 0).length}
              </Typography>
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
            placeholder="Cari barang berdasarkan nama, barcode, atau kategori..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyPress={handleSearch}
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
            onClick={fetchData}
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
            onClick={fetchData}
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
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column' }}>
            <Inventory sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
            <Typography color="text.secondary">{error}</Typography>
            <Button onClick={fetchData} sx={{ mt: 2 }}>Coba Lagi</Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>No</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Barcode</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Nama Barang</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Kategori</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Stok</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Harga Beli</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Harga Jual</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Margin</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Diskon</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#424242' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((b, i) => {
                  const status = getStockStatus(b.stok);
                  const profitMargin = ((b.harga_jual - (b.harga_jual * b.diskon / 100)) - b.harga_beli) / b.harga_beli * 100;
                  
                  return (
                    <TableRow 
                      key={b.id_barang}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: alpha('#f5f5f5', 0.5),
                        }
                      }}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {b.barcode}
                          <QrCode sx={{ fontSize: 16, color: '#9e9e9e' }} />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{b.nama_barang}</TableCell>
                      <TableCell>
                        <Chip 
                          label={b.nama_kategori || 'Tanpa Kategori'} 
                          size="small" 
                          sx={{ 
                            backgroundColor: alpha('#e0e0e0', 0.5),
                            color: '#424242'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={b.stok} 
                          size="small" 
                          color={status.color}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{formatCurrency(b.harga_beli)}</TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column">
                          <Typography 
                            fontWeight="600" 
                            fontSize="0.875rem" 
                            color={status.color}
                          >
                            {formatCurrency(b.harga_jual - (b.harga_jual * b.diskon / 100))}
                          </Typography>

                          {b.diskon > 0 && (
                            <>
                              <Typography 
                                variant="caption" 
                                sx={{ textDecoration: 'line-through'}}
                              >
                                {formatCurrency(b.harga_jual)}
                              </Typography>
                              <Typography variant="caption" color={status.color}>
                                -{formatCurrency((b.harga_jual * b.diskon) / 100)} 
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>


                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUp sx={{ fontSize: 16, color: getProfitColor(profitMargin) }} />
                          <Typography variant="body2" sx={{ color: getProfitColor(profitMargin), fontWeight: '600' }}>
                            {profitMargin.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {b.diskon > 0 ? (
                          <Chip 
                            icon={<LocalOffer />}
                            label={`${b.diskon}%`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={status.label} 
                          size="small" 
                          color={status.color}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {data.length === 0 && !loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', flexDirection: 'column' }}>
                <Inventory sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
                <Typography color="text.secondary">Tidak ada data barang</Typography>
                <Typography variant="body2" color="text.secondary">
                  {q ? `Tidak ditemukan hasil untuk "${q}"` : 'Mulai tambah barang pertama Anda'}
                </Typography>
              </Box>
            )}
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}