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
  Chip
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
  Save
} from "@mui/icons-material";
import api from "../../api";

export default function AddPembelian() {
  const [suppliers, setSuppliers] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
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

  const fetchMasters = async () => {
    setLoading(true);
    try {
      const [supRes, barangRes] = await Promise.all([
        api.get("/supplier"),
        api.get("/barang")
      ]);
      setSuppliers(supRes.data);
      setBarangList(barangRes.data);
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
      harga_jual_baru: 0
    }]);
    setError("");
  };

  const MARKUP_PERSEN = 20;

  const updateItem = (index, changes) => {
    setItems(prev =>
      prev.map((it, i) => {
        if (i !== index) return it;

        const updated = { ...it, ...changes };

        if (changes.harga_beli_baru !== undefined) {
          const hb = Number(changes.harga_beli_baru) || 0;
          updated.harga_jual_baru = Math.round(hb + (hb * MARKUP_PERSEN / 100));
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
                  Daftar Barang
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
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.8) }}>
                        <TableCell sx={{ fontWeight: '600' }}>Barang</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: 120 }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: 150 }}>Harga Beli</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: 150 }}>Harga Jual</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: 150 }}>Subtotal</TableCell>
                        <TableCell sx={{ fontWeight: '600', width: 80 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((it, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={it.id_barang}
                                onChange={(e) => {
                                  const idb = e.target.value;
                                  const sel = barangList.find(b => Number(b.id_barang) === Number(idb));
                                  updateItem(idx, {
                                    id_barang: idb,
                                    barcode: sel?.barcode || "",
                                    nama_barang: sel?.nama_barang || "",
                                    harga_beli_baru: sel?.harga_beli || 0,
                                    harga_jual_baru: sel?.harga_jual || 0
                                  });
                                }}
                                displayEmpty
                              >
                                <MenuItem value="">Pilih barang</MenuItem>
                                {barangList.map(b => (
                                  <MenuItem key={b.id_barang} value={b.id_barang}>
                                    {b.nama_barang} ({b.barcode})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.qty}
                              onChange={(e) => updateItem(idx, { qty: e.target.value })}
                              inputProps={{ min: 1 }}
                              fullWidth
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.harga_beli_baru}
                              onChange={(e) => updateItem(idx, { harga_beli_baru: e.target.value })}
                              inputProps={{ min: 0, step: 100 }}
                              fullWidth
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={it.harga_jual_baru}
                              onChange={(e) => updateItem(idx, { harga_jual_baru: e.target.value })}
                              inputProps={{ min: 0, step: 100 }}
                              fullWidth
                            />
                          </TableCell>

                          <TableCell>
                            <Typography fontWeight="600">
                              {formatCurrency(subtotal(it))}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <IconButton 
                              onClick={() => removeItem(idx)}
                              color="error"
                              size="small"
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
                    Klik "Tambah Barang" untuk memulai
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