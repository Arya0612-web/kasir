import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  Stack,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField, // 🔹 tambahkan ini
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";
import dayjs from "dayjs";
import api from "../../api";

export default function Laporan() {
  const [tab, setTab] = useState("pembelian");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [totalSum, setTotalSum] = useState(0);
  const [openRows, setOpenRows] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // 🔹 untuk search

  const [tokoList, setTokoList] = useState([]);
  const [selectedToko, setSelectedToko] = useState("");

  useEffect(() => {
    fetchTokoList();
  }, []);

  const fetchTokoList = async () => {
    try {
      const res = await api.get("/toko");
      setTokoList(res.data || []);
    } catch (err) {
      console.error("Gagal ambil daftar toko:", err);
      setTokoList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab, startDate, endDate, page, limit, selectedToko]);

  const fetchData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const res = await api.get(`/laporan/${tab}`, {
        params: {
          start: startDate.format("YYYY-MM-DD"),
          end: endDate.format("YYYY-MM-DD"),
          page: page + 1,
          limit,
          toko: selectedToko || "",
        },
      });

      const rows = (res.data.data || []).map((r, idx) => {
        const keyId = r.id_penjualan ?? r.id_pembelian ?? r.id_barang ?? idx;
        return { ...r, _rowId: keyId };
      });

      setData(rows);
      setPagination({
        totalItems: res.data.total || 0,
        currentPage: res.data.page || 1,
        pageSize: res.data.limit || limit,
      });
      setTotalSum(res.data.totalSum || 0);
      setOpenRows({});
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
      setData([]);
      setTotalSum(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleExport = async (type) => {
    try {
      const start = startDate.format("YYYY-MM-DD");
      const end = endDate.format("YYYY-MM-DD");
      const tokoParam = selectedToko ? `&toko=${selectedToko}` : "";

      const url = `${import.meta.env.VITE_API_URL}/laporan/export/${type}?jenis=${tab}&start=${start}&end=${end}${tokoParam}`;

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error("Gagal download file");

      const blob = await res.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const filename = `laporan-${tab}-${start}_sampai_${end}.${type === "excel" ? "xlsx" : "pdf"}`;
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = filename;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat download file");
    }
  };

  const toggleRow = (rowId) => {
    setOpenRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  // 🔹 Filter data sesuai kata pencarian
  const filteredData = data.filter((row) => {
    const q = searchQuery.toLowerCase();
    if (tab === "pembelian") {
      return (
        row.nama_toko?.toLowerCase().includes(q) ||
        row.no_faktur?.toLowerCase().includes(q) ||
        row.nama_supplier?.toLowerCase().includes(q)
      );
    } else if (tab === "penjualan") {
      return (
        row.nama_toko?.toLowerCase().includes(q) ||
        row.no_faktur?.toLowerCase().includes(q) ||
        row.nama_pelanggan?.toLowerCase().includes(q)
      );
    } else if (tab === "stok") {
      return (
        row.nama_toko?.toLowerCase().includes(q) ||
        row.barcode?.toLowerCase().includes(q) ||
        row.nama_barang?.toLowerCase().includes(q)
      );
    }
    return true;
  }); 

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="700" mb={2}>
        Laporan
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Pilih jenis laporan, toko, dan rentang tanggal
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 2, mb: 3, border: "1px solid #e0e0e0" }}>
        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab value="pembelian" label="Pembelian" />
          <Tab value="penjualan" label="Penjualan" />
          <Tab value="stok" label="Stok" />
        </Tabs>
      </Paper>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="toko-select-label">Pilih Toko</InputLabel>
            <Select
              labelId="toko-select-label"
              value={selectedToko}
              label="Pilih Toko"
              onChange={(e) => setSelectedToko(e.target.value)}
            >
              <MenuItem value="">Semua Toko</MenuItem>
              {tokoList.map((t) => (
                <MenuItem key={t.id_toko} value={t.id_toko}>
                  {t.nama_toko}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker label="Tanggal Mulai" value={startDate} onChange={setStartDate} />
          <DatePicker label="Tanggal Selesai" value={endDate} onChange={setEndDate} />

          {/* 🔹 Input Search */}
          <TextField
            variant="outlined"
            label="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              endAdornment: <Search color="action" />,
            }}
          />
        </Box>
      </LocalizationProvider>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="outlined" color="success" onClick={() => handleExport("excel")}>
          Export Excel
        </Button>
        <Button variant="outlined" color="error" onClick={() => handleExport("pdf")}>
          Export PDF
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {tab === "penjualan" && <TableCell sx={{ width: 50 }} />}
                    {tab === "pembelian" && <TableCell sx={{ width: 50 }} />}
                    {/* Tambahkan kolom nama toko di semua tab */}
                    <TableCell>Nama Toko</TableCell>

                    {tab === "pembelian" && (
                      <>
                      
                        <TableCell>No Faktur</TableCell>
                        <TableCell>Supplier</TableCell>
                        <TableCell>Tanggal</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </>
                    )}

                    {tab === "penjualan" && (
                      <>
                        <TableCell>No Faktur</TableCell>
                        <TableCell>Pelanggan</TableCell>
                        <TableCell>Tanggal</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </>
                    )}

                    {tab === "stok" && (
                      <>  
                        <TableCell>Tanggal</TableCell>
      
                        <TableCell>Nama Barang</TableCell>
                        <TableCell>Stok Masuk</TableCell>
                        <TableCell>Stok Keluar</TableCell>
                        <TableCell>Sisa</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    
                    <>
                      {filteredData.map((row, i) => {
                        const rowId = row._rowId ?? i;
                        const namaToko = row.nama_toko || "-";

                        if (tab === "stok") {
                          return (
                            <TableRow key={rowId}>
                              <TableCell>{row.nama_toko || "-"}</TableCell>
                              <TableCell>{dayjs(row.tanggal).format("YYYY-MM-DD")}</TableCell>
                              <TableCell>{row.nama_barang || "-"}</TableCell>
                              <TableCell align="right">{row.stok_masuk || 0}</TableCell>
                              <TableCell align="right">{row.stok_keluar || 0}</TableCell>
                              <TableCell align="right">{row.sisa_hari_ini || 0}</TableCell>
                            </TableRow>
                          );
                        }

                        if (tab === "pembelian") { 
                          return (
                            <React.Fragment key={rowId}>
                              <TableRow>
                                <TableCell width={50}>
                                  <IconButton size="small" onClick={() => toggleRow(rowId)}>
                                    {openRows[rowId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                  </IconButton>
                                </TableCell>
                                <TableCell>{namaToko}</TableCell>
                                <TableCell>{row.no_faktur}</TableCell>
                                <TableCell>{row.nama_supplier}</TableCell>
                                <TableCell>{dayjs(row.tgl_beli).format("DD/MM/YYYY")}</TableCell>
                                <TableCell align="right">
                                  {Number(row.total || 0).toLocaleString("id-ID")}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell colSpan={6} sx={{ p: 0, background: "#fafafa" }}>
                                  <Collapse in={!!openRows[rowId]} timeout="auto" unmountOnExit>
                                    <Box sx={{ m: 2 }}>
                                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Barang Dibeli
                                      </Typography>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Barcode</TableCell>
                                            <TableCell>Nama Barang</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Harga Beli Baru</TableCell>
                                            <TableCell>Harga Jual Baru</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {(row.details || []).map((d, j) => {
                                            const hargaBeli = Number(d.harga_beli_baru || 0);
                                            const qty = Number(d.qty || 0);
                                            const subtotal = qty * hargaBeli;
                                            return (
                                              <TableRow key={j}>
                                                <TableCell>{d.barcode}</TableCell>
                                                <TableCell>{d.nama_barang}</TableCell>
                                                <TableCell>{qty}</TableCell>
                                                <TableCell>{hargaBeli.toLocaleString("id-ID")}</TableCell>
                                                <TableCell>
                                                  {Number(d.harga_jual_baru || 0).toLocaleString("id-ID")}
                                                </TableCell>
                                                <TableCell align="right">
                                                  {subtotal.toLocaleString("id-ID")}
                                                </TableCell>
                                              </TableRow>
                                            );
                                          })}
                                          <TableRow>
                                            <TableCell colSpan={5} align="right" sx={{ fontWeight: 600 }}>
                                              Subtotal Transaksi:
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                              {(
                                                (row.details || []).reduce((sum, d) => {
                                                  const hargaBeli = Number(d.harga_beli_baru || 0);
                                                  const qty = Number(d.qty || 0);
                                                  return sum + qty * hargaBeli;
                                                }, 0) || 0
                                              ).toLocaleString("id-ID")}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          );
                        }

                        if (tab === "penjualan") {
                          return (
                            <React.Fragment key={rowId}>
                              <TableRow>
                                <TableCell width={50}>
                                  <IconButton size="small" onClick={() => toggleRow(rowId)}>
                                    {openRows[rowId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                  </IconButton>
                                </TableCell>
                                <TableCell>{namaToko}</TableCell>
                                <TableCell>{row.no_faktur}</TableCell>
                                <TableCell>{row.nama_pelanggan ?? "-"}</TableCell>
                                <TableCell>{dayjs(row.tgl_jual).format("DD/MM/YYYY")}</TableCell>
                                <TableCell align="right">{Number(row.total || 0).toLocaleString("id-ID")}</TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell colSpan={6} sx={{ p: 0, background: "#fafafa" }}>
                                  <Collapse in={!!openRows[rowId]} timeout="auto" unmountOnExit>
                                    <Box sx={{ m: 2 }}>
                                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Barang Terjual
                                      </Typography>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Barcode</TableCell>
                                            <TableCell>Nama Barang</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Satuan</TableCell>
                                            <TableCell>Harga</TableCell>
                                            <TableCell>Diskon</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {(row.details || []).map((d, j) => {
                                            const harga = Number(d.harga_jual || 0);
                                            const diskon = Number(d.diskon || 0);
                                            const qty = Number(d.qty || 0);
                                            const subtotal = qty * (harga - (harga * diskon) / 100);
                                            return (
                                              <TableRow key={j}>
                                                <TableCell>{d.barcode}</TableCell>
                                                <TableCell>{d.nama_barang}</TableCell>
                                                <TableCell>{qty}</TableCell>
                                                <TableCell>{d.satuan}</TableCell>
                                                <TableCell>{harga.toLocaleString("id-ID")}</TableCell>
                                                <TableCell>{diskon}%</TableCell>
                                                <TableCell align="right">{subtotal.toLocaleString("id-ID")}</TableCell>
                                              </TableRow>
                                            );
                                          })}
                                          <TableRow>
                                            <TableCell colSpan={6} align="right" sx={{ fontWeight: 600 }}>
                                              Subtotal Transaksi:
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                              {(
                                                (row.details || []).reduce((sum, d) => {
                                                  const hargaJual = Number(d.harga_jual || 0);
                                                  const diskon = Number(d.diskon || 0);
                                                  const qty = Number(d.qty || 0);
                                                  return sum + qty * (hargaJual - (hargaJual * diskon) / 100);
                                                }, 0) || 0
                                              ).toLocaleString("id-ID")}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          );
                        }
                      })}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {(tab === "penjualan" || tab === "pembelian") && (
              <Box sx={{ p: 2, textAlign: "right", fontWeight: "bold" }}>
                Total Keseluruhan: Rp {Number(totalSum || 0).toLocaleString("id-ID")}
              </Box>
            )}

            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={limit}
              onRowsPerPageChange={handleLimitChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
