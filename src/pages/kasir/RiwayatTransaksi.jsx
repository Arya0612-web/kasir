import { useEffect, useState } from "react";
import api from "../../api";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  TextField,
  Button,
  Stack,
  TablePagination,
  Card,
  CardContent,
  Grid,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment
} from "@mui/material";
import {
  Search,
  FilterList,
  PictureAsPdf,
  Visibility,
  Download,
  Close,
  Receipt,
  CalendarToday,
  Person,
  PointOfSale,
  AttachMoney,
  TrendingUp
} from "@mui/icons-material";

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

function formatCurrency(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(num || 0));
}

export default function RiwayatPenjualan() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedStruk, setSelectedStruk] = useState(null);
  const [strukLoading, setStrukLoading] = useState(false);
  const [totalPendapatan, setTotalPendapatan] = useState(0);

  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchRiwayat = async ({ pageIndex = page, limit = rowsPerPage, startDate = start, endDate = end } = {}) => {
    setLoading(true);
    try {
      const params = {
        page: pageIndex + 1,
        limit,
      };
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;

      const res = await api.get("/penjualan/riwayat/kasir", { params });

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
        setRiwayat(res.data);
        setTotalItems(res.data.length);
      } else {
        data = res.data.data || res.data.rows || [];
        const pagination = res.data.pagination || {};
        setRiwayat(data);
        setTotalItems(pagination.totalItems ?? data.length);
      }

      // Hitung total pendapatan
      const total = data.reduce((sum, item) => sum + Number(item.total || 0), 0);
      setTotalPendapatan(total);

    } catch (err) {
      console.error("Gagal ambil riwayat:", err);
      setRiwayat([]);
      setTotalItems(0);
      setTotalPendapatan(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat({ pageIndex: page, limit: rowsPerPage });
  }, [page, rowsPerPage]);

  const handleFilter = async () => {
    setPage(0);
    await fetchRiwayat({ pageIndex: 0, limit: rowsPerPage, startDate: start, endDate: end });
  };

  const handleResetFilter = () => {
    setStart("");
    setEnd("");
    setPage(0);
    fetchRiwayat({ pageIndex: 0, limit: rowsPerPage });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
  };

  const handlePreviewStruk = async (penjualan) => {
    setStrukLoading(true);
    setSelectedStruk(penjualan);
    setPreviewOpen(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setStrukLoading(false);
    }, 1000);
  };

  const handleDownloadStruk = async (id_penjualan, no_faktur) => {
    try {
      const res = await api.get(`/penjualan/${id_penjualan}/struk`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `struk-${no_faktur}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal download struk:", err);
    }
  };

  const getStatusColor = (total, bayar) => {
    const kembali = bayar - total;
    if (kembali < 0) return ERROR_COLOR;
    if (kembali === 0) return SUCCESS_COLOR;
    return "#ff9800"; // warning color
  };

  // Format date range untuk display
  const getDateRangeText = () => {
    if (start && end) {
      return `${new Date(start).toLocaleDateString('id-ID')} - ${new Date(end).toLocaleDateString('id-ID')}`;
    } else if (start) {
      return `Mulai ${new Date(start).toLocaleDateString('id-ID')}`;
    } else if (end) {
      return `Sampai ${new Date(end).toLocaleDateString('id-ID')}`;
    }
    return "Semua Waktu";
  };

  return (
    <Box sx={{ p: 3, background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Card 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          background: WHITE,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
              <Receipt sx={{ fontSize: 32, color: PURPLE }} />
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
                Riwayat Penjualan
              </Typography>
              <Typography variant="h6" color={GRAY_MEDIUM}>
                Kelola dan pantau semua transaksi penjualan
              </Typography>
            </Box>
          </Box>

          {/* Total Pendapatan Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`,
                  color: WHITE,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(PURPLE, 0.3)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="600" sx={{ opacity: 0.9 }}>
                        Total Pendapatan
                      </Typography>
                      <Typography variant="h4" fontWeight="800" sx={{ mt: 1 }}>
                        {formatCurrency(totalPendapatan)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                        {getDateRangeText()}
                      </Typography>
                    </Box>
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: `linear-gradient(135deg, ${SUCCESS_COLOR} 0%, #2e7d32 100%)`,
                  color: WHITE,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(SUCCESS_COLOR, 0.3)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="600" sx={{ opacity: 0.9 }}>
                        Total Transaksi
                      </Typography>
                      <Typography variant="h4" fontWeight="800" sx={{ mt: 1 }}>
                        {totalItems}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                        {getDateRangeText()}
                      </Typography>
                    </Box>
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid> */}

            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: `linear-gradient(135deg, ${GRAY_DARK} 0%, #616161 100%)`,
                  color: WHITE,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(GRAY_DARK, 0.3)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="600" sx={{ opacity: 0.9 }}>
                        Rata-rata
                      </Typography>
                      <Typography variant="h4" fontWeight="800" sx={{ mt: 1 }}>
                        {formatCurrency(totalItems > 0 ? totalPendapatan / totalItems : 0)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                        Per transaksi
                      </Typography>
                    </Box>
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filter Section */}
          {/* <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: alpha(PURPLE, 0.02),
              border: `1px solid ${alpha(PURPLE, 0.1)}`
            }}
          >
            <Typography variant="h6" fontWeight="600" color={BLACK} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList /> Filter Tanggal
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Tanggal Mulai"
                  InputLabelProps={{ shrink: true }}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: PURPLE, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Tanggal Akhir"
                  InputLabelProps={{ shrink: true }}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: PURPLE, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleFilter}
                    startIcon={<Search />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      bgcolor: PURPLE,
                      '&:hover': {
                        bgcolor: PURPLE_DARK,
                        boxShadow: `0 4px 12px ${alpha(PURPLE, 0.3)}`,
                      },
                    }}
                  >
                    Terapkan Filter
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleResetFilter}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      borderColor: alpha(GRAY_MEDIUM, 0.5),
                      color: GRAY_MEDIUM,
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper> */}
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card 
        sx={{ 
          borderRadius: 3,
          background: WHITE,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Table Header */}
          <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="700" color={BLACK}>
              📋 Daftar Transaksi ({totalItems})
            </Typography>
            
            <Chip 
              label={`Halaman ${page + 1} dari ${Math.ceil(totalItems / rowsPerPage)}`}
              sx={{ 
                bgcolor: PURPLE_LIGHT, 
                color: PURPLE,
                fontWeight: '600'
              }} 
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: PURPLE }} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>No Faktur</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>Tanggal</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem' }}>Kasir</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'right' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'right' }}>Bayar</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'right' }}>Kembali</TableCell>
                      <TableCell sx={{ fontWeight: '700', color: BLACK, fontSize: '0.875rem', textAlign: 'center', width: 200 }}>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riwayat.length > 0 ? (
                      riwayat.map((row) => (
                        <TableRow 
                          key={row.id_penjualan}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: alpha(PURPLE, 0.02),
                            }
                          }}
                        >
                          <TableCell>
                            <Chip 
                              label={row.no_faktur} 
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
                            <Typography fontSize="0.875rem">
                              {new Date(row.created_at || row.tgl_jual).toLocaleString("id-ID")}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Person sx={{ fontSize: 16, color: GRAY_MEDIUM }} />
                              <Typography fontSize="0.875rem">
                                {row.nama_user}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography fontWeight="600" fontSize="0.875rem">
                              {formatCurrency(row.total)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography fontSize="0.875rem" color={SUCCESS_COLOR}>
                              {formatCurrency(row.bayar)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Typography 
                              fontSize="0.875rem" 
                              fontWeight="600"
                              color={getStatusColor(row.total, row.bayar)}
                            >
                              {formatCurrency(row.kembali)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Preview Struk">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePreviewStruk(row)}
                                  sx={{
                                    bgcolor: alpha(PURPLE, 0.1),
                                    color: PURPLE,
                                    '&:hover': {
                                      bgcolor: PURPLE,
                                      color: WHITE,
                                    }
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PDF">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadStruk(row.id_penjualan, row.no_faktur)}
                                  sx={{
                                    bgcolor: alpha(ERROR_COLOR, 0.1),
                                    color: ERROR_COLOR,
                                    '&:hover': {
                                      bgcolor: ERROR_COLOR,
                                      color: WHITE,
                                    }
                                  }}
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <PointOfSale sx={{ fontSize: 48, color: alpha(GRAY_LIGHT, 0.5), mb: 2 }} />
                          <Typography variant="body1" color={GRAY_MEDIUM} sx={{ mb: 1 }}>
                            Tidak ada data transaksi
                          </Typography>
                          <Typography variant="body2" color={GRAY_LIGHT}>
                            Coba ubah filter tanggal atau lakukan penjualan pertama
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {riwayat.length > 0 && (
                <TablePagination
                  component="div"
                  count={totalItems}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Struk Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {strukLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress sx={{ color: PURPLE }} />
            </Box>
          ) : selectedStruk && (
            <Box sx={{ p: 3 }}>
              {/* Struk Preview */}
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: WHITE,
                  border: `2px dashed ${alpha(GRAY_LIGHT, 0.5)}`,
                  maxWidth: 300,
                  mx: 'auto'
                }}
              >
                {/* Header Struk */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="800" color={BLACK}>
                    TOKO KITA
                  </Typography>
                  <Typography variant="caption" color={GRAY_MEDIUM}>
                    Jl. Ahmad Yani No.1, Banjar
                  </Typography>
                  <Box sx={{ my: 1, borderTop: `1px solid ${GRAY_LIGHT}` }} />
                </Box>

                {/* Info Transaksi */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="600">No Faktur:</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>{selectedStruk.no_faktur}</Typography>
                  <br />
                  <Typography variant="caption" fontWeight="600">Tanggal:</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {new Date(selectedStruk.created_at || selectedStruk.tgl_jual).toLocaleString("id-ID")}
                  </Typography>
                  <br />
                  <Typography variant="caption" fontWeight="600">Kasir:</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>{selectedStruk.nama_user}</Typography>
                </Box>

                <Box sx={{ my: 1, borderTop: `1px solid ${GRAY_LIGHT}` }} />

                {/* Total */}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight="600">Total:</Typography>
                    <Typography variant="caption" fontWeight="600">{formatCurrency(selectedStruk.total)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight="600">Bayar:</Typography>
                    <Typography variant="caption" fontWeight="600" color={SUCCESS_COLOR}>
                      {formatCurrency(selectedStruk.bayar)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" fontWeight="600">Kembali:</Typography>
                    <Typography variant="caption" fontWeight="600" color={getStatusColor(selectedStruk.total, selectedStruk.bayar)}>
                      {formatCurrency(selectedStruk.kembali)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ my: 1, borderTop: `1px solid ${GRAY_LIGHT}` }} />

                {/* Footer */}
                <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                  === Terima kasih ===
                </Typography>
              </Paper>

              <Alert 
                severity="info" 
                sx={{ mt: 2, borderRadius: 2 }}
                icon={<PictureAsPdf />}
              >
                Struk akan dicetak dalam format PDF dengan layout thermal printer
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            startIcon={<Close />}
            sx={{ borderRadius: 2 }}
          >
            Tutup
          </Button>
          {selectedStruk && (
            <Button
              onClick={() => handleDownloadStruk(selectedStruk.id_penjualan, selectedStruk.no_faktur)}
              variant="contained"
              startIcon={<Download />}
              sx={{ 
                borderRadius: 2,
                bgcolor: PURPLE,
                '&:hover': { bgcolor: PURPLE_DARK }
              }}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}