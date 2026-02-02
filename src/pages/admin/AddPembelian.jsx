import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Alert,
  Divider,
  Chip,
  Autocomplete,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import {
  Add,
  Delete,
  LocalShipping,
  Receipt,
  CalendarToday,
  Person,
  AttachMoney,
  Calculate,
  Save,
  Search
} from "@mui/icons-material";
import api from "../../api";

export default function AddPembelian() {
  const [suppliers, setSuppliers] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form, setForm] = useState({
    id_supplier: "",
    nama_supplier: "",
    no_faktur: "",
    pengirim: "",
    ket_bayar_id: "",
    bayar: 0,
    tgl_beli: new Date().toISOString().slice(0,10)
  });

  useEffect(() => {
    fetchMasters();
  }, []);

  useEffect(() => {
    // Filter barang berdasarkan search term
    if (searchTerm) {
      const filtered = barangList.filter(barang =>
        barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barang.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBarang(filtered);
    } else {
      setFilteredBarang(barangList);
    }
  }, [searchTerm, barangList]);

  const fetchMasters = async () => {
    setLoading(true);
    try {
      const [supRes, barangRes] = await Promise.all([
        api.get("/supplier"),
        api.get("/barang")
      ]);
      setSuppliers(supRes.data);
      setBarangList(barangRes.data);
      setFilteredBarang(barangRes.data);
    } catch (err) {
      console.error("Gagal ambil master data:", err);
      setError("Gagal memuat data supplier dan barang");
    } finally {
      setLoading(false);
    }
  };

  const addEmptyItem = () => {
    setItems(prev => [...prev, { 
      id_barang: "", 
      barcode: "", 
      nama_barang: "", 
      qty: 1, 
      harga_beli_baru: 0,
      harga_jual_baru: 0,
      margin: 0
    }]);
    setError("");
  };

  const updateItem = (index, changes) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;

        const updated = { ...it, ...changes };

        // jika harga beli berubah → hitung harga jual sesuai margin
        if (changes.harga_beli_baru !== undefined) {
          const hb = Number(changes.harga_beli_baru) || 0;
          const marginPersen = Number(updated.margin) || 0;
          updated.harga_jual_baru = Math.round(hb + (hb * marginPersen) / 100);
        }

        // jika margin berubah → hitung ulang harga jual
        if (changes.margin !== undefined && updated.harga_beli_baru) {
          const hb = Number(updated.harga_beli_baru);
          const marginPersen = Number(changes.margin);
          updated.harga_jual_baru = Math.round(hb + (hb * marginPersen) / 100);
        }

        // jika harga jual berubah manual → update margin otomatis
        if (changes.harga_jual_baru !== undefined && updated.harga_beli_baru) {
          const hb = Number(updated.harga_beli_baru);
          const hj = Number(changes.harga_jual_baru);
          updated.margin = hb ? Math.round(((hj - hb) / hb) * 100) : 0;
        }

        return updated;
      })
    );
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = (it) => (Number(it.qty || 0) * Number(it.harga_beli_baru || 0));
  const total = items.reduce((s, it) => s + subtotal(it), 0);
  const sisa = total - Number(form.bayar || 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBarangSelect = (index, selectedBarang) => {
    if (selectedBarang) {
      updateItem(index, {
        id_barang: selectedBarang.id_barang,
        barcode: selectedBarang.barcode,
        nama_barang: selectedBarang.nama_barang,
        harga_beli_baru: selectedBarang.harga_beli || 0,
        harga_jual_baru: selectedBarang.harga_jual || 0,
        margin: selectedBarang.harga_beli ? 
          Math.round(((selectedBarang.harga_jual - selectedBarang.harga_beli) / selectedBarang.harga_beli) * 100) : 0,
      });
    } else {
      // Reset jika tidak ada pilihan
      updateItem(index, {
        id_barang: "",
        barcode: "",
        nama_barang: "",
        harga_beli_baru: 0,
        harga_jual_baru: 0,
        margin: 0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.id_supplier) {
      setError("Pilih supplier terlebih dahulu");
      return;
    }
    
    if (items.length === 0) {
      setError("Masukkan minimal 1 barang");
      return;
    }

    for (const it of items) {
      if (!it.id_barang || !it.harga_beli_baru || !it.qty || !it.harga_jual_baru) {
        setError("Lengkapi semua field untuk setiap item barang");
        return;
      }
    }

    const payload = {
      tgl_beli: form.tgl_beli,
      id_supplier: form.id_supplier,
      nama_supplier: suppliers.find(s => s.supplier_id === Number(form.id_supplier))?.nama_supplier || form.nama_supplier,
      no_faktur: form.no_faktur,
      pengirim: form.pengirim,
      ket_bayar_id: form.ket_bayar_id || null,
      bayar: Number(form.bayar || 0),
      items: items.map(it => ({
        id_barang: Number(it.id_barang),
        barcode: it.barcode,
        nama_barang: it.nama_barang,
        qty: Number(it.qty),
        harga_beli_baru: Number(it.harga_beli_baru),
        harga_jual_baru: Number(it.harga_jual_baru)
      }))
    };

    setLoading(true);
    try {
      const res = await api.post("/pembelian", payload);
      setSuccess(`Pembelian berhasil disimpan (ID: ${res.data.id_beli})`);
      
      // Reset form
      setForm({
        id_supplier: "",
        nama_supplier: "",
        no_faktur: "",
        pengirim: "",
        ket_bayar_id: "",
        bayar: 0,
        tgl_beli: new Date().toISOString().slice(0,10)
      });
      setItems([]);
      setSearchTerm("");
    } catch (err) {
      console.error("Gagal simpan pembelian:", err.response?.data || err.message);
      setError("Gagal simpan pembelian: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
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
            Tambah Pembelian Baru
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Input data pembelian barang dari supplier
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Form Supplier Section */}
        <Grid item xs={12}>
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
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: '#424242', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping /> Informasi Supplier
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      label="Supplier"
                      value={form.id_supplier}
                      onChange={(e) => setForm({...form, id_supplier: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#616161' }} />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="">-- Pilih Supplier --</MenuItem>
                      {suppliers.map(s => (
                        <MenuItem key={s.supplier_id} value={s.supplier_id}>
                          {s.nama_supplier}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Tanggal Pembelian"
                    type="date"
                    value={form.tgl_beli}
                    onChange={(e) => setForm({...form, tgl_beli: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#616161' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="No. Faktur"
                    value={form.no_faktur}
                    onChange={(e) => setForm({...form, no_faktur: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Receipt sx={{ color: '#616161' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Pengirim"
                    value={form.pengirim}
                    onChange={(e) => setForm({...form, pengirim: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#616161' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Bar Section */}
        <Grid item xs={12}>
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
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#424242' }}>
                Cari Barang
              </Typography>
              <TextField
                fullWidth
                placeholder="Cari barang berdasarkan nama atau barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#616161' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              {searchTerm && (
                <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  <List>
                    {filteredBarang.slice(0, 10).map((barang) => (
                      <ListItem
                        key={barang.id_barang}
                        button
                        onClick={() => {
                          addEmptyItem();
                          // Set item terakhir yang baru ditambahkan
                          setTimeout(() => {
                            const lastIndex = items.length;
                            handleBarangSelect(lastIndex, barang);
                          }, 0);
                          setSearchTerm("");
                        }}
                        sx={{
                          border: `1px solid ${alpha('#000000', 0.1)}`,
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: alpha('#000000', 0.04),
                          }
                        }}
                      >
                        <ListItemText
                          primary={barang.nama_barang}
                          secondary={`Barcode: ${barang.barcode} • Harga Beli: ${formatCurrency(barang.harga_beli)} • Stok: ${barang.stok}`}
                        />
                      </ListItem>
                    ))}
                    {filteredBarang.length === 0 && (
                      <ListItem>
                        <ListItemText 
                          primary="Tidak ada barang ditemukan" 
                          secondary="Coba dengan kata kunci lain"
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </CardContent> */}
          </Card>
        </Grid>

        {/* Items Section */}
        <Grid item xs={12}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600" color="#424242">
                  Daftar Barang ({items.length} item)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addEmptyItem}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: '500'
                  }}
                >
                  Tambah Barang
                </Button>
              </Box>

              {items.length > 0 ? (
                <TableContainer>
                  <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                        <TableCell sx={{ fontWeight: '600', width: '35%' }}>Barang</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: '12%', minWidth: 90 }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: '15%', minWidth: 120 }}>Harga Beli</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: '13%', minWidth: 100 }}>Margin (%)</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: '15%', minWidth: 120 }}>Harga Jual</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: '15%', minWidth: 120 }}>Subtotal</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: '5%', minWidth: 60 }}></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {items.map((it, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Autocomplete
                              options={filteredBarang}
                              getOptionLabel={(option) => 
                                `${option.nama_barang} (${option.barcode})`
                              }
                              value={barangList.find(b => b.id_barang === it.id_barang) || null}
                              onChange={(event, newValue) => {
                                handleBarangSelect(idx, newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Pilih atau ketik nama barang..."
                                  size="small"
                                  sx={{ 
                                    '& .MuiInputBase-root': { 
                                      height: '40px',
                                      fontSize: '0.875rem'
                                    } 
                                  }}
                                />
                              )}
                              renderOption={(props, option) => (
                                <li {...props}>
                                  <Box>
                                    <Typography variant="body2">
                                      {option.nama_barang}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Barcode: {option.barcode} • Stok: {option.stok} • 
                                      Harga: {formatCurrency(option.harga_beli)}
                                    </Typography>
                                  </Box>
                                </li>
                              )}
                              sx={{ minWidth: 200 }}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.qty}
                              onChange={(e) => updateItem(idx, { qty: e.target.value })}
                              inputProps={{ 
                                min: 1,
                                style: { 
                                  textAlign: 'center',
                                  fontSize: '0.875rem',
                                  padding: '8px 4px'
                                }
                              }}
                              sx={{ 
                                width: '100%',
                                '& .MuiInputBase-root': { 
                                  height: '40px'
                                }
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.harga_beli_baru}
                              onChange={(e) =>
                                updateItem(idx, { harga_beli_baru: e.target.value })
                              }
                              inputProps={{ 
                                min: 0, 
                                step: 100,
                                style: { 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  padding: '8px 4px'
                                }
                              }}
                              sx={{ 
                                width: '100%',
                                '& .MuiInputBase-root': { 
                                  height: '40px'
                                }
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.margin || 0}
                              onChange={(e) => {
                                const newMargin = Number(e.target.value) || 0;
                                const newHargaJual =
                                  Number(it.harga_beli_baru) +
                                  (Number(it.harga_beli_baru) * newMargin) / 100;
                                updateItem(idx, {
                                  margin: newMargin,
                                  harga_jual_baru: Math.round(newHargaJual),
                                });
                              }}
                              inputProps={{ 
                                min: 0, 
                                max: 100,
                                style: { 
                                  textAlign: 'center',
                                  fontSize: '0.875rem',
                                  padding: '8px 4px'
                                }
                              }}
                              sx={{ 
                                width: '100%',
                                '& .MuiInputBase-root': { 
                                  height: '40px'
                                }
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.harga_jual_baru}
                              onChange={(e) =>
                                updateItem(idx, { harga_jual_baru: e.target.value })
                              }
                              inputProps={{ 
                                min: 0, 
                                step: 100,
                                style: { 
                                  textAlign: 'right',
                                  fontSize: '0.875rem',
                                  padding: '8px 4px'
                                }
                              }}
                              sx={{ 
                                width: '100%',
                                '& .MuiInputBase-root': { 
                                  height: '40px'
                                }
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography 
                              fontWeight="600" 
                              sx={{ 
                                fontSize: '0.875rem',
                                textAlign: 'right',
                                paddingRight: 1
                              }}
                            >
                              {formatCurrency(subtotal(it))}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <IconButton 
                              onClick={() => removeItem(idx)} 
                              color="error" 
                              size="small"
                              sx={{ 
                                padding: '8px',
                                '& .MuiSvgIcon-root': { 
                                  fontSize: '1.2rem' 
                                } 
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Belum ada barang ditambahkan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Klik "Tambah Barang"
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12}>
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
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: '#424242', display: 'flex', alignItems: 'center', gap: 1 }}>
                 Ringkasan Pembayaran
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Total Pembelian
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color="#2c2c2c">
                      {formatCurrency(total)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Jumlah Bayar"
                    type="number"
                    value={form.bayar}
                    onChange={(e) => setForm({...form, bayar: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney sx={{ color: '#616161' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: alpha(sisa >= 0 ? '#4caf50' : '#f44336', 0.1), borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Sisa Pembayaran
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color={sisa >= 0 ? '#2e7d32' : '#d32f2f'}>
                      {formatCurrency(sisa >= 0 ? sisa : 0)}
                    </Typography>
                    {sisa < 0 && (
                      <Chip 
                        label="Kurang Bayar" 
                        size="small" 
                        color="error" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setForm({
                      id_supplier: "",
                      nama_supplier: "",
                      no_faktur: "",
                      pengirim: "",
                      ket_bayar_id: "",
                      bayar: 0,
                      tgl_beli: new Date().toISOString().slice(0,10)
                    });
                    setItems([]);
                    setError("");
                    setSuccess("");
                    setSearchTerm("");
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Reset
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || items.length === 0}
                  startIcon={<Save />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    fontWeight: '600',
                    textTransform: 'none',
                    background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
                    '&:hover': {
                      background: `linear-gradient(45deg, #424242 30%, #616161 90%)`,
                    },
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Pembelian'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}