import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Modal,
  Snackbar,
  Backdrop,
  Fade
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  Receipt,
  QrCode,
  ShoppingCart,
  Payment,
  Calculate,
  Print,
  Close
} from "@mui/icons-material";
import api from "/src/api";
import axios from "axios";

export default function Penjualan() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [bayar, setBayar] = useState(0);
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [idPenjualan, setIdPenjualan] = useState(null);
  const [showStruk, setShowStruk] = useState(false);
  const [lastPenjualan, setLastPenjualan] = useState(null);
  const [ketBayarList, setKetBayarList] = useState([]);
  const [ketTransaksiList, setKetTransaksiList] = useState([]);
  const [selectedKetBayar, setSelectedKetBayar] = useState("");
  const [selectedKetTransaksi, setSelectedKetTransaksi] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeQtyField, setActiveQtyField] = useState(null);

  // Refs untuk input fields
  const barcodeRef = useRef(null);
  const searchRef = useRef(null);
  const bayarRef = useRef(null);
  const ketBayarRef = useRef(null);
  const ketTransaksiRef = useRef(null);
  const qtyRefs = useRef({});

  // Load metode pembayaran dan status transaksi
  useEffect(() => {
    const fetchKetOptions = async () => {
      try {
        const [bayarRes, transaksiRes] = await Promise.all([
          api.get("/ket/bayar"),
          api.get("/ket/transaksi"),
        ]);
        setKetBayarList(bayarRes.data || []);
        setKetTransaksiList(transaksiRes.data || []);
        
        // Set default values jika ada
        if (bayarRes.data && bayarRes.data.length > 0) {
          setSelectedKetBayar(bayarRes.data[0].id_ket);
        }
        if (transaksiRes.data && transaksiRes.data.length > 0) {
          setSelectedKetTransaksi(transaksiRes.data[0].id_ket);
        }
      } catch (err) {
        console.error("Gagal memuat data keterangan", err);
        showSnackbar("Gagal memuat data keterangan", "error");
      }
    };

    fetchKetOptions();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // --- Cari barang manual (nama/barcode) ---
  const searchBarang = async () => {
    if (!search) {
      setResults([]);
      setHighlightedIndex(-1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/barang/kasir?search=${encodeURIComponent(search)}`);
      setResults(res.data || []);
      setHighlightedIndex(0); // Set highlight ke item pertama setelah pencarian
    } catch (err) {
      setError("Gagal mencari barang");
      showSnackbar("Gagal mencari barang", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk search barang dengan debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBarang();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1 fokus ke barcode
      if (e.key === "F1") {
        e.preventDefault();
        barcodeRef.current?.focus();
      }

      // F2 fokus ke pencarian manual
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }

      // Enter di pencarian -> tambah barang yang di-highlight
      if (e.key === "Enter" && document.activeElement?.id === "search-input") {
        e.preventDefault();
        if (results.length > 0 && highlightedIndex >= 0) {
          addToCart(results[highlightedIndex]);
        }
      }

      // F3 fokus ke input bayar
      if (e.key === "F3") {
        e.preventDefault();
        bayarRef.current?.focus();
      }

      // F4 simpan transaksi
      if (e.key === "F4") {
        e.preventDefault();
        submit();
      }

      // F5 fokus ke metode pembayaran
      // if (e.key === "F5") {
      //   e.preventDefault();
      //   ketBayarRef.current?.focus();
      // }

      // // F6 fokus ke status transaksi
      // if (e.key === "F6") {
      //   e.preventDefault();
      //   ketTransaksiRef.current?.focus();
      // }

      // Delete -> hapus item terakhir
      if (e.key === "Delete" && cart.length > 0 && !activeQtyField) {
        e.preventDefault();
        const lastItem = cart[cart.length - 1];
        removeItem(lastItem.id_barang);
      }

      // Esc -> bersihkan pencarian atau keluar dari input qty
      if (e.key === "Escape") {
        e.preventDefault();
        if (activeQtyField) {
          setActiveQtyField(null);
        } else {
          setSearch("");
          setResults([]);
          setHighlightedIndex(-1);
        }
      }

      // Panah bawah -> pindah ke hasil berikutnya (hanya jika tidak di input qty)
      if (e.key === "ArrowDown" && results.length > 0 && !activeQtyField) {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      }

      // Panah atas -> pindah ke hasil sebelumnya (hanya jika tidak di input qty)
      if (e.key === "ArrowUp" && results.length > 0 && !activeQtyField) {
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
      }

      // Enter pada hasil yang di-highlight (selain di input field)
      if (e.key === "Enter" && highlightedIndex >= 0 && 
          !document.activeElement?.id?.includes('input') &&
          !activeQtyField) {
        e.preventDefault();
        if (results[highlightedIndex]) {
          addToCart(results[highlightedIndex]);
        }
      }

      // Shortcut untuk input qty - panah atas/bawah
      if (activeQtyField && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const item = cart.find(c => c.id_barang === activeQtyField);
        if (item) {
          const change = e.key === "ArrowUp" ? 1 : -1;
          const newQty = Math.max(1, item.qty + change);
          if (newQty <= item.stok) {
            updateQty(activeQtyField, newQty);
          }
        }
      }

      // Tab untuk navigasi antar input qty
      if (e.key === "Tab" && activeQtyField && cart.length > 0) {
        e.preventDefault();
        const currentIndex = cart.findIndex(item => item.id_barang === activeQtyField);
        if (currentIndex !== -1) {
          const nextIndex = e.shiftKey ? 
            (currentIndex > 0 ? currentIndex - 1 : cart.length - 1) :
            (currentIndex < cart.length - 1 ? currentIndex + 1 : 0);
          
          const nextItem = cart[nextIndex];
          if (nextItem && qtyRefs.current[nextItem.id_barang]) {
            setActiveQtyField(nextItem.id_barang);
            setTimeout(() => {
              qtyRefs.current[nextItem.id_barang]?.focus();
              qtyRefs.current[nextItem.id_barang]?.select();
            }, 0);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [results, cart, barcode, search, bayar, highlightedIndex, activeQtyField]);

  // Reset highlighted index ketika results berubah
  useEffect(() => {
    if (results.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [results]);

  // --- Tambah barang ke keranjang ---
  const addToCart = (item) => {
    if (item.stok <= 0) {
      setError("Stok barang habis");
      showSnackbar("Stok barang habis", "error");
      return;
    }

    const existing = cart.find((c) => c.id_barang === item.id_barang);
    if (existing) {
      if (existing.qty >= item.stok) {
        setError("Stok tidak mencukupi");
        showSnackbar("Stok tidak mencukupi", "error");
        return;
      }
      setCart(
        cart.map((c) =>
          c.id_barang === item.id_barang ? { ...c, qty: c.qty + 1 } : c
        )
      );
      showSnackbar(`${item.nama_barang} ditambahkan ke keranjang`, "success");
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
      showSnackbar(`${item.nama_barang} ditambahkan ke keranjang`, "success");
    }
    setError("");
    
    // Clear search setelah berhasil tambah ke keranjang
    setSearch("");
    setResults([]);
    setHighlightedIndex(-1);
  };

  // --- Tambah via barcode langsung ---
  const addByBarcode = async (e) => {
    e.preventDefault();
    if (!barcode) return;

    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/barang/cari-barcode?barcode=${barcode}`);
      const b = res.data[0];

      if (!b) {
        setError("Barang tidak ditemukan!");
        showSnackbar("Barang tidak ditemukan!", "error");
        setBarcode("");
        return;
      }

      addToCart(b);
      setBarcode("");
    } catch (err) {
      console.error(err);
      setError("Error mengambil data barang");
      showSnackbar("Error mengambil data barang", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Update keranjang ---
  const updateQty = (id, qty) => {
    const newQty = Number(qty);
    if (newQty < 1) return;
    
    const item = cart.find(c => c.id_barang === id);
    if (item && newQty > item.stok) {
      setError("Stok tidak mencukupi");
      showSnackbar("Stok tidak mencukupi", "error");
      return;
    }

    setCart(
      cart.map((c) => (c.id_barang === id ? { ...c, qty: newQty } : c))
    );
    setError("");
  };

  const removeItem = (id) => {
    const item = cart.find(c => c.id_barang === id);
    setCart(cart.filter((c) => c.id_barang !== id));
    if (item) {
      showSnackbar(`${item.nama_barang} dihapus dari keranjang`, "info");
    }
    if (activeQtyField === id) {
      setActiveQtyField(null);
    }
  };

  // Handle focus pada input qty
  const handleQtyFocus = (id) => {
    setActiveQtyField(id);
  };

  const handleQtyBlur = () => {
    setActiveQtyField(null);
  };

  // --- Hitung total & kembali ---
  const total = cart.reduce(
    (s, it) =>
      s + (Number(it.harga_jual) * (1 - Number(it.diskon || 0) / 100)) * it.qty,
    0
  );
  const kembali = Number(bayar || 0) - total;

  // --- Submit penjualan ---
  const submit = async () => {
    if (cart.length === 0) {
      setError("Keranjang kosong!");
      showSnackbar("Keranjang kosong!", "error");
      return;
    }
    if (bayar < total) {
      setError("Uang bayar kurang!");
      showSnackbar("Uang bayar kurang!", "error");
      return;
    }

    if (!selectedKetBayar || !selectedKetTransaksi) {
      setError("Pilih metode pembayaran dan status transaksi!");
      showSnackbar("Pilih metode pembayaran dan status transaksi!", "error");
      return;
    }

    const payload = {
      tgl_jual: new Date().toISOString().slice(0, 10),
      items: cart.map((c) => ({
        id_barang: c.id_barang,
        barcode: c.barcode,
        nama_barang: c.nama_barang,
        qty: c.qty,
        harga_beli: c.harga_beli || 0,
        harga_jual: c.harga_jual,
        diskon: c.diskon || 0,
        satuan: c.satuan || "",
      })),
      bayar: Number(bayar) || 0,
      kembali,
      id_ket_bayar: selectedKetBayar,
      id_ket_transaksi: selectedKetTransaksi,
    };

    setLoading(true);
    try {
      const res = await api.post("/penjualan", payload);
      setIdPenjualan(res.data.id_penjualan);

      // simpan data struk terakhir
      setLastPenjualan(res.data);
      setShowStruk(true);
        
      // Reset form
      setCart([]);
      setBayar(0);
      setResults([]);
      setSearch("");
      setError("");
      setHighlightedIndex(-1);
      setActiveQtyField(null);
      
      showSnackbar(`Transaksi berhasil! Faktur: ${res.data.no_faktur}`, "success");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Sesi habis, silakan login ulang!");
        showSnackbar("Sesi habis, silakan login ulang!", "error");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMsg = err.response?.data?.message || "Gagal simpan penjualan";
        setError(errorMsg);
        showSnackbar(errorMsg, "error");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCetak = async (id) => {
    try {
      const res = await api.get(`/penjualan/${id}/struk`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(blob);

      // Langsung download
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `struk-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Langsung buka print dialog
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = fileURL;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.print();
      };

      showSnackbar("Struk berhasil dicetak", "success");
    } catch (err) {
      console.error("Gagal cetak struk", err);
      showSnackbar("Gagal mencetak struk", "error");
    }
  };

  const handleCloseStruk = () => {
    setShowStruk(false);
    setLastPenjualan(null);
  };

  // Handle mouse hover untuk highlight
  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  const handleMouseLeave = () => {
    // Tidak reset highlight saat mouse leave, biarkan keyboard navigation tetap bekerja
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="700"
            sx={{
              color: '#000000',
              mb: 1
            }}
          >
            Point of Sale (POS)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistem penjualan kasir toko
          </Typography>
        </Box>
        
        <Chip 
          icon={<ShoppingCart />}
          label={`${cart.length} Items`}
          variant="outlined"
          sx={{ 
            borderColor: '#000000', 
            color: '#000000',
            fontWeight: '600'
          }}
        />
      </Box>

      {/* Shortcut Helper */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: '#000000' }}>
          Shortcut Keyboard:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label="F1: Input Barcode" size="small" variant="outlined" />
          <Chip label="F2: Pencarian Barang" size="small" variant="outlined" />
          <Chip label="F3: Input Bayar" size="small" variant="outlined" />
          <Chip label="F4: Simpan Transaksi" size="small" variant="outlined" />
          {/* <Chip label="F5: Metode Bayar" size="small" variant="outlined" />
          <Chip label="F6: Status Transaksi" size="small" variant="outlined" /> */}
          <Chip label="Delete: Hapus Terakhir" size="small" variant="outlined" />
          <Chip label="Esc: Bersihkan/Keluar" size="small" variant="outlined" />
          <Chip label="↑/↓: Navigasi/Qty" size="small" variant="outlined" />
          <Chip label="Enter: Tambah Barang" size="small" variant="outlined" />
          <Chip label="Tab: Navigasi Qty" size="small" variant="outlined" />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel - Product Search */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={1}
            sx={{
              borderRadius: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              height: 'fit-content',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#000000' }}>
                Cari Barang
              </Typography>

              {/* Barcode Input */}
              <form onSubmit={addByBarcode}>
                <TextField
                  id="barcode-input"
                  inputRef={barcodeRef}
                  fullWidth
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scan / ketik barcode..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QrCode sx={{ color: '#616161' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </form>

              {/* Manual Search */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  id="search-input"
                  inputRef={searchRef}
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari barang (nama/barcode)..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#616161' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Search Results */}
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: '#000000' }}>
                Hasil Pencarian ({results.length})
              </Typography>
              
              {results.length > 0 ? (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {results.map((r, index) => (
                    <ListItem
                      key={r.id_barang}
                      sx={{
                        border: `1px solid ${alpha('#000000', 0.1)}`,
                        borderRadius: 1,
                        mb: 1,
                        alignItems: "flex-start",
                        backgroundColor: highlightedIndex === index ? alpha('#000000', 0.08) : 'transparent',
                        '&:hover': {
                          backgroundColor: alpha('#000000', 0.04),
                        },
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => addToCart(r)}
                    >
                      <Box sx={{ flex: 1, pr: 2 }}>
                        <Typography fontWeight="500" color="#000000">{r.nama_barang}</Typography>
                        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                          <Typography variant="body2" color="#000000">
                            {formatCurrency(r.harga_jual)}
                          </Typography>
                          {r.diskon > 0 && (
                            <Chip
                              label={`Diskon ${r.diskon}%`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                height: 20, 
                                borderColor: '#000000',
                                color: '#000000'
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Stok: {r.stok} • Barcode: {r.barcode}
                        </Typography>
                      </Box>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(r);
                        }}
                        startIcon={<Add />}
                        variant="outlined"
                        size="small"
                        disabled={r.stok <= 0}
                        sx={{
                          borderColor: '#000000',
                          color: '#000000',
                          '&:hover': {
                            backgroundColor: '#000000',
                            color: '#ffffff'
                          }
                        }}
                      >
                        Tambah
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Search sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {search ? 'Tidak ada hasil pencarian' : 'Cari barang untuk memulai'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Cart & Payment */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={1}
            sx={{
              borderRadius: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: '#000000', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart /> Keranjang Belanja
              </Typography>

              {cart.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha('#000000', 0.04) }}>
                        <TableCell sx={{ fontWeight: '600', color: '#000000' }}>Barang</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: '#000000', width: 100 }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: '#000000', width: 120 }}>Subtotal</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: '#000000', width: 60 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((c) => (
                        <TableRow 
                          key={c.id_barang} 
                          hover
                          sx={{
                            backgroundColor: activeQtyField === c.id_barang ? alpha('#000000', 0.04) : 'transparent'
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography fontWeight="500" color="#000000">{c.nama_barang}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatCurrency(c.harga_jual)}
                                {c.diskon > 0 && ` - ${c.diskon}%`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <TextField
                              inputRef={el => qtyRefs.current[c.id_barang] = el}
                              type="number"
                              value={c.qty}
                              onChange={(e) => updateQty(c.id_barang, e.target.value)}
                              onFocus={() => handleQtyFocus(c.id_barang)}
                              onBlur={handleQtyBlur}
                              size="small"
                              inputProps={{ 
                                min: 1, 
                                max: c.stok,
                                style: { 
                                  textAlign: 'center',
                                  backgroundColor: activeQtyField === c.id_barang ? alpha('#000000', 0.08) : 'transparent'
                                }
                              }}
                              sx={{ width: 70 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="600" color="#000000">
                              {formatCurrency((c.harga_jual * (1 - (c.diskon || 0) / 100)) * c.qty)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => removeItem(c.id_barang)}
                              size="small"
                              sx={{ color: '#000000' }}
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
                  <ShoppingCart sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Keranjang belanja kosong
                  </Typography>
                </Box>
              )}

              {/* Payment Section */}
              {cart.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" color="#000000">
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="#000000">
                      {formatCurrency(total)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                    <TextField
                      id="bayar-input"
                      inputRef={bayarRef}
                      fullWidth
                      label="Jumlah Bayar"
                      value={bayar}
                      onChange={(e) => setBayar(e.target.value)}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Payment sx={{ color: '#616161' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Metode Pembayaran dan Status Transaksi */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      inputRef={ketBayarRef}
                      select
                      fullWidth
                      label="Metode Pembayaran"
                      value={selectedKetBayar}
                      onChange={(e) => setSelectedKetBayar(e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {ketBayarList.map((k) => (
                        <option key={k.id_ket} value={k.id_ket}>
                          {k.uraian}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      inputRef={ketTransaksiRef}
                      select
                      fullWidth
                      label="Status Transaksi"
                      value={selectedKetTransaksi}
                      onChange={(e) => setSelectedKetTransaksi(e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {ketTransaksiList.map((k) => (
                        <option key={k.id_ket} value={k.id_ket}>
                          {k.uraian}
                        </option>
                      ))}
                    </TextField>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body1" fontWeight="600" color="#000000">
                      Kembalian:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="600" 
                      color={kembali >= 0 ? '#000000' : '#d32f2f'}
                    >
                      {formatCurrency(kembali >= 0 ? kembali : 0)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={submit}
                    disabled={loading}
                    sx={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#333333',
                      },
                      '&:disabled': {
                        backgroundColor: '#bdbdbd',
                      }
                    }}
                  >
                    {loading ? "Memproses..." : "Simpan Penjualan"}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal Struk */}
      <Modal
        open={showStruk}
        onClose={handleCloseStruk}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showStruk}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: '#ffffff',
            border: '2px solid #000000',
            borderRadius: 2,
            boxShadow: 24,
            p: 0
          }}>
            {/* Header Modal */}
            <Box sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" fontWeight="600">
                Struk Penjualan
              </Typography>
              <IconButton 
                onClick={handleCloseStruk}
                sx={{ color: '#ffffff' }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Content Modal */}
            <Box sx={{ p: 3 }}>
              {lastPenjualan && (
                <>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" color="#000000">
                      TOKO ANDA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Terima kasih atas kunjungan Anda
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography color="#000000">
                      <strong>No Faktur:</strong> {lastPenjualan.no_faktur}
                    </Typography>
                    <Typography color="#000000">
                      <strong>Tanggal:</strong> {lastPenjualan.tgl_jual}
                    </Typography>
                    <Typography color="#000000">
                      <strong>Kasir:</strong> System
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List sx={{ mb: 2 }}>
                    {lastPenjualan.items?.map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                        <ListItemText
                          primary={
                            <Typography color="#000000" fontWeight="500">
                              {item.nama_barang}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {item.qty} {item.satuan} × {formatCurrency(item.harga_jual)}
                              </Typography>
                              <Typography variant="body2" fontWeight="600" color="#000000">
                                {formatCurrency(item.harga_jual * item.qty)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="#000000"><strong>Total:</strong></Typography>
                      <Typography color="#000000" fontWeight="600">
                        {formatCurrency(lastPenjualan.total)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="#000000"><strong>Bayar:</strong></Typography>
                      <Typography color="#000000" fontWeight="600">
                        {formatCurrency(lastPenjualan.bayar)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="#000000"><strong>Kembali:</strong></Typography>
                      <Typography color="#000000" fontWeight="600">
                        {formatCurrency(lastPenjualan.kembali)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button 
                      onClick={() => handleCetak(idPenjualan)} 
                      variant="contained" 
                      startIcon={<Print />}
                      fullWidth
                      sx={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#333333',
                        }
                      }}
                    >
                      CETAK STRUK
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleCloseStruk}
                      fullWidth
                      sx={{
                        borderColor: '#000000',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#000000',
                          color: '#ffffff'
                        }
                      }}
                    >
                      TUTUP
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'success' ? '#4caf50' : 
                           snackbar.severity === 'error' ? '#f44336' :
                           snackbar.severity === 'info' ? '#2196f3' : '#ff9800',
            color: '#ffffff',
            '& .MuiAlert-icon': { color: '#ffffff' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}