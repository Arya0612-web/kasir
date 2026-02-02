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
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Public as PublicIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import api from "../../../api";

const PURPLE = "#9588e8";

export default function ProfileCompany({ data }) {
  const p = data.perusahaan || {};
  const [form, setForm] = useState({
    nama_perusahaan: p.nama_perusahaan || "",
    alamat: p.alamat || "",
    telepon: p.telepon || "",
    email: p.email || "",
    website: p.website || ""
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await api.post("/profile/update", form);
      setSuccess("Profil perusahaan berhasil diperbarui!");
      setIsEdit(false);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan profil perusahaan");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setForm({
      nama_perusahaan: p.nama_perusahaan || "",
      alamat: p.alamat || "",
      telepon: p.telepon || "",
      email: p.email || "",
      website: p.website || ""
    });
    setError("");
    setSuccess("");
  };

  const InfoField = ({ icon, label, name, value, multiline = false, rows = 1 }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Box sx={{ 
        backgroundColor: alpha(PURPLE, 0.1),
        borderRadius: '12px',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {React.cloneElement(icon, { sx: { color: PURPLE, fontSize: 20 } })}
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
            <BusinessIcon color="primary" />
            Profil Perusahaan
          </Typography>
          
          {!isEdit ? (
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              onClick={() => setIsEdit(true)}
              sx={{
                borderRadius: 2,
                borderColor: PURPLE,
                color: PURPLE,
                '&:hover': {
                  borderColor: PURPLE,
                  bgcolor: alpha(PURPLE, 0.1)
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
                  bgcolor: PURPLE,
                  '&:hover': { bgcolor: '#7a6de5' },
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
              icon={<BusinessIcon />}
              label="Nama Perusahaan"
              name="nama_perusahaan"
              value={form.nama_perusahaan}
            />
            
            <InfoField
              icon={<EmailIcon />}
              label="Email Perusahaan"
              name="email"
              value={form.email}
            />
            
            <InfoField
              icon={<PhoneIcon />}
              label="Telepon"
              name="telepon"
              value={form.telepon}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InfoField
              icon={<LocationIcon />}
              label="Alamat"
              name="alamat"
              value={form.alamat}
              multiline
              rows={3}
            />
            
            <InfoField
              icon={<PublicIcon />}
              label="Website"
              name="website"
              value={form.website}
            />
          </Grid>
        </Grid>

        {/* Additional Info */}
        {!isEdit && (
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Informasi Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Status Akun Perusahaan
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {data.user?.status_akun === 'active' ? 'Aktif' : 'Non-Aktif'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Terdaftar Sejak
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {new Date(data.user?.created_at).toLocaleDateString('id-ID')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}