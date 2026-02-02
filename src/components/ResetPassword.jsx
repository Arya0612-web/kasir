import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, VpnKey } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import api from "../api";

const DARK_GRAY = "#2c2c2c";
const MEDIUM_GRAY = "#5a5a5a";
const LIGHT_GRAY = "#616161";
const HOVER_GRAY = "#424242";
const BACKGROUND_LIGHT = "#f8f9fa";
const BACKGROUND_DARKER = "#e9ecef";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccess(res.data.message || "Password berhasil diubah");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Token tidak valid atau sudah kadaluarsa");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha('#f5f5f7', 0.9)} 0%, ${alpha('#e0e0e0', 0.9)} 100%)`,
        backdropFilter: 'blur(10px)',
        p: 2
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          background: `linear-gradient(145deg, ${BACKGROUND_LIGHT}, ${BACKGROUND_DARKER})`,
          boxShadow: '12px 12px 24px #d1d1d1, -12px -12px 24px #ffffff',
          border: '1px solid rgba(255, 255, 255, 0.7)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <VpnKey 
            sx={{ 
              fontSize: 40, 
              color: LIGHT_GRAY,
              mb: 1
            }} 
          />
          <Typography 
            variant="h4" 
            fontWeight="700"
            sx={{
              background: `linear-gradient(45deg, ${DARK_GRAY} 30%, ${MEDIUM_GRAY} 90%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Buat password baru untuk akun Anda
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'error.light',
              backgroundColor: alpha('#f44336', 0.05)
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'success.light',
              backgroundColor: alpha('#4caf50', 0.05)
            }}
          >
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Password Baru"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: LIGHT_GRAY }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha('#fff', 0.6),
                '&:hover fieldset': {
                  borderColor: '#8d8d8d',
                },
                '&.Mui-focused fieldset': {
                  borderColor: LIGHT_GRAY,
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Konfirmasi Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: LIGHT_GRAY }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha('#fff', 0.6),
                '&:hover fieldset': {
                  borderColor: '#8d8d8d',
                },
                '&.Mui-focused fieldset': {
                  borderColor: LIGHT_GRAY,
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !!success}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: '600',
              textTransform: 'none',
              fontSize: '1rem',
              background: `linear-gradient(45deg, ${DARK_GRAY} 30%, ${MEDIUM_GRAY} 90%)`,
              boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': {
                background: `linear-gradient(45deg, ${HOVER_GRAY} 30%, ${LIGHT_GRAY} 90%)`,
                boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
              },
              '&:disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? "Memproses..." : success ? "Berhasil!" : "Ubah Password"}
          </Button>
        </Box>

        
      </Paper>
    </Box>
  );
}