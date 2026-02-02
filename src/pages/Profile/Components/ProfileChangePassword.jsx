import { useState } from "react";
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Stack, 
  Box,
  Alert,
  IconButton,
  InputAdornment,
  alpha,
  CircularProgress
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import api from "../../../api";

const PURPLE = "#9588e8";

export default function ProfileChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!form.currentPassword) {
      setError("Password saat ini harus diisi");
      return false;
    }
    if (!form.newPassword) {
      setError("Password baru harus diisi");
      return false;
    }
    if (form.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return false;
    }
    if (form.currentPassword === form.newPassword) {
      setError("Password baru harus berbeda dengan password saat ini");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await api.post("/profile/change-password", form);
      setSuccess(res.data.message || "Password berhasil diubah!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ label, name, value, showPassword, toggleShow, placeholder }) => (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: PURPLE }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleShow}
                edge="end"
                sx={{ color: PURPLE }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LockIcon color="primary" />
          Ubah Password
        </Typography>

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

        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          <PasswordField
            label="Password Saat Ini"
            name="currentPassword"
            value={form.currentPassword}
            showPassword={showCurrentPassword}
            toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
            placeholder="Masukkan password saat ini"
          />
          
          <PasswordField
            label="Password Baru"
            name="newPassword"
            value={form.newPassword}
            showPassword={showNewPassword}
            toggleShow={() => setShowNewPassword(!showNewPassword)}
            placeholder="Minimal 6 karakter"
          />
          
          <PasswordField
            label="Konfirmasi Password Baru"
            name="confirmPassword"
            value={form.confirmPassword}
            showPassword={showConfirmPassword}
            toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="Ulangi password baru"
          />

          <Box sx={{ mt: 4, p: 3, bgcolor: alpha(PURPLE, 0.05), borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color={PURPLE} gutterBottom>
              Tips Password yang Aman:
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                • Minimal 6 karakter
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Kombinasi huruf besar dan kecil
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Gunakan angka dan simbol
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Jangan gunakan password yang mudah ditebak
              </Typography>
            </Stack>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
            onClick={submit}
            disabled={loading}
            size="large"
            sx={{
              mt: 4,
              borderRadius: 2,
              py: 1.5,
              bgcolor: PURPLE,
              '&:hover': { bgcolor: '#7a6de5' },
            }}
          >
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}