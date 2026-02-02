import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Close,
  Lock
} from "@mui/icons-material";
import api from "../api";

const BLACK = "#000000";
const WHITE = "#ffffff";
const PURPLE = "#9588e8";
const PURPLE_DARK = "#7a6de5";
const RED = "#f44336";
const GREEN = "#4caf50";

export default function ChangePasswordForm({ open, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleClickShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password baru harus minimal 6 karakter");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/company/change-password", formData);
      setSuccess(response.data.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Lock sx={{ color: PURPLE }} />
            <Typography variant="h6" fontWeight="600">
              Ubah Password
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            name="currentPassword"
            label="Password Saat Ini"
            type={showPassword.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("current")}
                    edge="end"
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="newPassword"
            label="Password Baru"
            type={showPassword.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Minimal 6 karakter"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("new")}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="confirmPassword"
            label="Konfirmasi Password Baru"
            type={showPassword.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("confirm")}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: WHITE }} /> : null}
          sx={{
            borderRadius: 2,
            px: 3,
            bgcolor: PURPLE,
            '&:hover': { bgcolor: PURPLE_DARK },
          }}
        >
          {loading ? "Mengubah..." : "Ubah Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}