import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Alert,
  Typography,
  CircularProgress,
  InputAdornment,
  Paper,
  Card,
  CardContent
} from "@mui/material";
import {
  Email,
  ArrowBack,
  Security
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import api from "../api";

const DARK_GRAY = "#2c2c2c";
const MEDIUM_GRAY = "#5a5a5a";
const LIGHT_GRAY = "#616161";
const HOVER_GRAY = "#424242";
const BACKGROUND_LIGHT = "#f8f9fa";
const BACKGROUND_DARKER = "#e9ecef";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email) {
      setError("Email harus diisi");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(response.data.message || "Link reset password telah dikirim ke email Anda");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim email reset password. Periksa email Anda atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BACKGROUND_LIGHT} 0%, ${BACKGROUND_DARKER} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2
      }}
    >
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header Section */}
        <Box 
          sx={{ 
            textAlign: "center", 
            mb: 4,
            width: "100%"
          }}
        >
          <Typography 
            component="h1" 
            variant="h3"
            fontWeight="700"
            gutterBottom
            sx={{
              background: `linear-gradient(45deg, ${DARK_GRAY} 30%, ${MEDIUM_GRAY} 90%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Lupa Password
          </Typography>
          
        </Box>

        {/* Form Card */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 3,
            background: `linear-gradient(145deg, ${alpha('#fff', 0.9)} 0%, ${alpha('#f5f5f5', 0.8)} 100%)`,
            boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              {/* Instruction Text */}
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.6,
                  color: '#5a5a5a',
                  fontWeight: 500,
                  textAlign: 'center'
                }}
              >
                Masukkan alamat email yang terdaftar pada akun Anda. 
                Kami akan mengirimkan link untuk mereset password Anda.
              </Typography>

              {/* Alerts */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
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
                    mb: 3, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'success.light',
                    backgroundColor: alpha('#4caf50', 0.05)
                  }}
                >
                  {success}
                </Alert>
              )}

              {/* Email Input */}
              <TextField
                fullWidth
                name="email"
                label="Alamat Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
                disabled={loading || !!success}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: LIGHT_GRAY }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha('#fff', 0.8),
                    '&:hover fieldset': {
                      borderColor: '#8d8d8d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: LIGHT_GRAY,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    '&.Mui-focused': {
                      color: LIGHT_GRAY,
                    },
                  },
                }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                {/* <Button 
                  onClick={handleBackToLogin}
                  variant="outlined"
                  disabled={loading}
                  startIcon={<ArrowBack />}
                  fullWidth
                  sx={{ 
                    borderRadius: 2, 
                    py: 1.5,
                    fontWeight: '600',
                    textTransform: 'none',
                    fontSize: '1rem',
                    borderColor: '#8d8d8d',
                    color: '#5a5a5a',
                    '&:hover': {
                      borderColor: HOVER_GRAY,
                      backgroundColor: alpha(LIGHT_GRAY, 0.04),
                      color: DARK_GRAY,
                    },
                    '&:disabled': {
                      borderColor: '#e0e0e0',
                      color: '#bdbdbd'
                    }
                  }}
                >
                  Kembali ke Login
                </Button> */}
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !!success}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: '600',
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: `linear-gradient(45deg, ${DARK_GRAY} 30%, ${MEDIUM_GRAY} 90%)`,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${HOVER_GRAY} 30%, ${LIGHT_GRAY} 90%)`,
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#9e9e9e',
                      boxShadow: 'none',
                      transform: 'none'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {loading ? "Mengirim..." : success ? "Email Terkirim!" : "Kirim Link Reset"}
                </Button>
              </Box>

              {/* Success Message Additional Info */}
              {success && (
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    borderRadius: 2,
                    backgroundColor: alpha('#4caf50', 0.05),
                    border: `1px solid ${alpha('#4caf50', 0.2)}`
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="success.main"
                    textAlign="center"
                    fontWeight="500"
                  >
                    ✓ Periksa inbox email Anda dan ikuti instruksi untuk reset password.
                    <br />
                    <Button 
                      onClick={handleBackToLogin}
                      color="success"
                      sx={{ 
                        mt: 1,
                        fontWeight: '600',
                        textTransform: 'none'
                      }}
                    >
                      Klik di sini untuk kembali ke halaman login
                    </Button>
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Box 
          sx={{ 
            mt: 4, 
            textAlign: "center",
            maxWidth: 400
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ opacity: 0.7 }}
          >
            Jika Anda mengalami kesulitan, pastikan email yang dimasukkan benar dan periksa folder spam.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}