import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  LinearProgress,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api";

export default function PetunjukPembayaran() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [uploading, setUploading] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const rekening = "1234567890 (BCA a.n. PT Teknologi Arya)";

  /* ============================================
     🔹 1. Ambil status perusahaan
  ============================================ */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/perusahaan/status", { withCredentials: true });
        setStatus(res.data.status);
        setCompanyId(res.data.id_perusahaan);
      } catch (err) {
        setStatus("error");
        setMessage("Gagal memuat status akun perusahaan.");
      }
    };
    fetchStatus();
  }, []);

  /* ============================================
     🔹 2. Ambil daftar paket langganan
  ============================================ */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/subscription", { withCredentials: true });
        setPlans(res.data);
      } catch (err) {
        toast.error("Gagal memuat daftar paket langganan");
      }
    };
    fetchPlans();
  }, []);

  const handlePlanChange = (e) => {
    const id = e.target.value;
    const selected = plans.find((p) => p.id_plan === id);
    setSelectedPlan(selected);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ============================================
     🔹 3. Upload File Bukti Pembayaran
  ============================================ */
  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB.");
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!companyId) return toast.error("ID perusahaan belum terdeteksi.");
    if (!file) return toast.warn("Pilih file bukti terlebih dahulu.");
    if (!selectedPlan) return toast.warn("Pilih paket langganan terlebih dahulu.");

    const formData = new FormData();
    formData.append("bukti", file);
    formData.append("amount", selectedPlan.price);
    formData.append("plan_id", selectedPlan.id_plan);
    formData.append("perusahaan_id", companyId);

    try {
      setUploading(true);
      const res = await api.post("./payments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success(res.data.message || "Bukti berhasil dikirim. Menunggu verifikasi admin.");
      setFile(null);
      setSelectedPlan("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengunggah bukti pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  /* ============================================
     🔹 4. Aktivasi Paket Gratis
  ============================================ */
  const handleGratisSubmit = async () => {
    if (!companyId) return toast.error("ID perusahaan belum terdeteksi.");
    if (!selectedPlan) return toast.warn("Pilih paket langganan terlebih dahulu.");

    const formData = new FormData();
    formData.append("plan_id", selectedPlan.id_plan);
    formData.append("perusahaan_id", companyId);

    try {
      const res = await api.post("./payments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success(res.data.message || "Paket gratis berhasil diaktifkan!");
      setFile(null);
      setSelectedPlan("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengaktifkan paket gratis.");
    } finally {
      setUploading(false);
    }
  };

  /* ============================================
     🔹 5. Render Utama
  ============================================ */

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper sx={{ p: 4, width: "100%", maxWidth: 680, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          💳 Petunjuk Pembayaran & Aktivasi
        </Typography>

        {/* STATUS */}
        {status === "loading" ? (
          <LinearProgress />
        ) : status === "error" ? (
          <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>
        ) : (
          <Alert
            severity={
              status === "active"
                ? "success"
                : status === "pending"
                ? "warning"
                : status === "expired"
                ? "error"
                : "info"
            }
            sx={{ mb: 3 }}
          >
            {status === "active" && "Akun Anda sudah aktif dan dapat menggunakan semua fitur sistem."}
            {status === "pending" && "Akun Anda masih pending. Silakan pilih paket dan unggah bukti pembayaran."}
            {status === "expired" && "Langganan Anda telah kedaluwarsa. Silakan perpanjang sekarang."}
            {status === "suspended" && "Akun Anda dinonaktifkan. Hubungi admin."}
          </Alert>
        )}

        {/* FORM JIKA PENDING / EXPIRED */}
{(status === "pending" || status === "expired") && (
  <Stack spacing={2}>

    {/* Dropdown Paket */}
    <FormControl fullWidth>
      <InputLabel>Pilih Paket Langganan</InputLabel>
      <Select
        value={selectedPlan?.id_plan || ""}
        label="Pilih Paket Langganan"
        onChange={handlePlanChange}
      >
        {plans.map((p) => (
          <MenuItem key={p.id_plan} value={p.id_plan}>
            {p.name} — Rp {p.price.toLocaleString("id-ID")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Nominal */}
    <TextField
      fullWidth
      label="Nominal Pembayaran"
      value={selectedPlan ? `Rp ${selectedPlan.price.toLocaleString("id-ID")}` : ""}
      disabled
    />

    {/* ============================= */}
    {/*     PLAN GRATIS (HILANGKAN)   */}
    {/* ============================= */}
    {selectedPlan && selectedPlan.price < 10  && (
      <>
        <Alert severity="info">
          Paket <b>{selectedPlan.name}</b> dapat dinikmati secara <b>GRATIS</b>.
          Anda tidak perlu mengunggah bukti pembayaran.
        </Alert>

        <Button
          variant="contained"
          color="success"
          onClick={handleGratisSubmit}
          disabled={uploading}
        >
          {uploading ? "Memproses..." : "Aktifkan Paket Gratis"}
        </Button>
      </>
    )}

    {/* ============================= */}
    {/*     PLAN BERBAYAR (TAMPIL)    */}
    {/* ============================= */}
    {selectedPlan && selectedPlan.price > 0 && (
      <>
        <Divider sx={{ my: 1 }} />

        {/* Rekening */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {rekening}
          </Typography>

          <Button variant="outlined" size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
            Salin
          </Button>
        </Box>

        {/* Langkah Pembayaran */}
        <Typography variant="subtitle1" fontWeight="bold">
          Langkah-langkah Pembayaran:
        </Typography>
        <ol style={{ marginTop: 4, marginBottom: 8 }}>
          <li>Pilih paket langganan yang ingin digunakan.</li>
          <li>Transfer sesuai nominal ke rekening di atas.</li>
          <li>Unggah bukti pembayaran di bawah ini.</li>
          <li>Tunggu verifikasi superadmin.</li>
        </ol>

        {/* Upload */}
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
          Pilih Bukti Pembayaran (jpg/png/pdf)
          <input hidden type="file" accept="image/*,application/pdf" onChange={onFileChange} />
        </Button>

        {file && (
          <Typography variant="body2" color="text.secondary">
            File dipilih: {file.name}
          </Typography>
        )}

        <Button
          variant="contained"
          color="success"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
        </Button>
      </>
    )}

  </Stack>
)}

        {/* SUDAH AKTIF */}
        {status === "active" && (
          <Stack alignItems="center" mt={3}>
            <Button variant="contained" color="primary" onClick={() => navigate("/dashboard-adminperusahaan")}>
              Buka Dashboard
            </Button>
          </Stack>
        )}

        {/* Snackbar */}
        <Snackbar open={copied} autoHideDuration={2000}>
          <Alert severity="success" sx={{ width: "100%" }}>
            Nomor rekening disalin!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
