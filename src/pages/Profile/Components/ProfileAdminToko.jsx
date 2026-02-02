import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Box,
  Alert,
  CircularProgress,
  Grid,
  alpha
} from "@mui/material";
import {
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import api from "../../../api";

const ORANGE = "#FF9800";

export default function ProfileAdminToko({ data }) {
  const t = data.toko || {};
  const [form, setForm] = useState({
    nama_toko: t.nama_toko || "",
    alamat_toko: t.alamat_toko || "",
    no_wa_toko: t.no_wa_toko || "",
    email_toko: t.email_toko || ""
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await api.post("/profile/update", form);
      setSuccess("Profil toko berhasil diperbarui!");
      setIsEdit(false);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan profil toko");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setForm({
      nama_toko: t.nama_toko || "",
      alamat_toko: t.alamat_toko || "",
      no_wa_toko: t.no_wa_toko || "",
      email_toko: t.email_toko || ""
    });
    setError("");
    setSuccess("");
  };

  const InfoField = ({ icon, label, name, value, multiline = false, rows = 1 }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Box sx={{ 
        backgroundColor: alpha(ORANGE, 0.1),
        borderRadius: '12px',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {React.cloneElement(icon, { sx: { color: ORANGE, fontSize: 20 } })}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {isEdit ? (
          <TextField
            fullWidth
            size="small"
            name={name}
            value={value}
            onChange={handleChange}
            multiline={multiline}
            rows={rows}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        ) : (
          <Typography variant="body1" fontWeight="500">
            {value || "Belum diatur"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StoreIcon color="warning" />
            Profil Toko
          </Typography>
          
          {!isEdit ? (
            <Button
              variant="outlined"
              startIcon={<StoreIcon />}
              onClick={() => setIsEdit(true)}
              sx={{
                borderRadius: 2,
                borderColor: ORANGE,
                color: ORANGE,
                '&:hover': {
                  borderColor: ORANGE,
                  bgcolor: alpha(ORANGE, 0.1)
                }
              }}
            >
              Edit Profil
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                onClick={cancelEdit}
                startIcon={<CancelIcon />}
                variant="outlined"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Batal
              </Button>
              <Button
                onClick={save}
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SaveIcon />}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  bgcolor: ORANGE,
                  '&:hover': { bgcolor: '#f57c00' },
                }}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </Stack>
          )}
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
          <Grid item xs={12} md={6}>
            <InfoField
              icon={<StoreIcon />}
              label="Nama Toko"
              name="nama_toko"
              value={form.nama_toko}
            />
            
            <InfoField
              icon={<PhoneIcon />}
              label="Nomor WhatsApp"
              name="no_wa_toko"
              value={form.no_wa_toko}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InfoField
              icon={<LocationIcon />}
              label="Alamat Toko"
              name="alamat_toko"
              value={form.alamat_toko}
              multiline
              rows={3}
            />
            
            <InfoField
              icon={<EmailIcon />}
              label="Email Toko"
              name="email_toko"
              value={form.email_toko}
            />
          </Grid>
        </Grid>

        {/* Admin Info */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Informasi Admin Toko
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Nama Admin
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {data.user?.nama_user}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Status Akun
              </Typography>
              <Typography variant="body1" fontWeight={500} color={
                data.user?.status_akun === 'active' ? 'success.main' : 
                data.user?.status_akun === 'expired' ? 'error.main' : 
                'text.secondary'
              }>
                {data.user?.status_akun === 'active' ? 'Aktif' : 
                 data.user?.status_akun === 'expired' ? 'Kedaluwarsa' : 
                 data.user?.status_akun === 'pending' ? 'Menunggu Verifikasi' : 
                 'Belum Berlangganan'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}