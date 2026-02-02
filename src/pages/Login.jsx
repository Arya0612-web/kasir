import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  InputAdornment,
  IconButton,
  Link,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock,
  PointOfSale
} from '@mui/icons-material';
import api from '../api';
import { alpha } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // username/email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [openForgot, setOpenForgot] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.data?.user) {
          let redirectTo = "/";
          if (res.data.user.id_level === 1) redirectTo = "/dashboard-admin";
          if (res.data.user.id_level === 2) redirectTo = "/transaksi";
          if (res.data.user.id_level === 3) redirectTo = "/dashboard-adminperusahaan";
          if (res.data.user.id_level === 0) redirectTo = "/dashboardsuperadmin";
          navigate(redirectTo, { replace: true });
        }
      } catch (err) {
        // tidak ada session, tetap di halaman login
        if (err.response?.status !== 401) {
          console.error("Gagal cek session:", err);
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const submit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.warn("Username/email dan password wajib diisi");
      return;
    }

    try {
      const res = await api.post(
        "/auth/login", 
        { identifier, password },
        { withCredentials: true }
      );

      toast.success(`Selamat datang, ${res.data.user?.nama || 'User'}!`, {
        position: "top-right",
      });

      setTimeout(() => navigate(res.data.redirectTo || "/"), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal";
      toast.error(msg, { position: "top-right" });

      if (err.response?.data?.needVerification) {
        const email = identifier;
        if (window.confirm("Email belum diverifikasi. Kirim ulang verifikasi ke email ini?")) {
          await api.post("/auth/resend-verification", { email });
          toast.success("Email verifikasi baru dikirim!");
        }
      }
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          maxWidth: 420,
          borderRadius: 3,
          background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
          boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
          border: '1px solid rgba(255, 255, 255, 0.7)',
        }}
      >
        {/* Header dengan styling template */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PointOfSale 
            sx={{ 
              fontSize: 40, 
              color: '#424242',
              mb: 1
            }} 
          />
          <Typography 
            variant="h5" 
            fontWeight="700"
            sx={{
              background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Selamat Datang Kembali
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Masuk ke akun Anda untuk melanjutkan
          </Typography>
        </Box>

        {/* Form Login */}
        <Box component="form" onSubmit={submit}>
          {/* Email/Username Field */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              fontWeight="600" 
              sx={{ mb: 1, display: 'block' }}
            >
              Username atau Email
            </Typography>
            <TextField
              fullWidth
              placeholder="example@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#616161' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha('#fff', 0.8),
                  '&:hover fieldset': {
                    borderColor: '#9e9e9e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#616161',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.5,
                }
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight="600">
                Password
              </Typography>
              
            </Box>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#616161' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha('#fff', 0.8),
                  '&:hover fieldset': {
                    borderColor: '#9e9e9e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#616161',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.5,
                }
              }}
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate("/forgot-password")}
              sx={{
                mt: 1,
                color: '#616161',
                fontSize: '0.75rem',
                textDecoration: 'none',
                '&:hover': {
                  color: '#424242',
                  textDecoration: 'underline',
                },
              }}
            >
              Lupa Password?
            </Link>

          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: '600',
              textTransform: 'none',
              fontSize: '1rem',
              background: `linear-gradient(45deg, #2c2c2c 30%, #5a5a5a 90%)`,
              boxShadow: '0 3px 5px 2px rgba(97, 97, 97, .3)',
              '&:hover': {
                background: `linear-gradient(45deg, #424242 30%, #616161 90%)`,
                boxShadow: '0 5px 8px 2px rgba(97, 97, 97, .4)',
              },
            }}
          >
            Masuk
          </Button>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Belum punya akun?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/register-perusahaan")}
                sx={{
                  color: '#424242',
                  fontWeight: '600',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#2c2c2c',
                    textDecoration: 'underline',
                  },
                }}
              >
                Daftar di sini
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Terms and Conditions */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center" 
          sx={{ 
            display: 'block', 
            mt: 3,
            px: 2
          }}
        >
          Dengan melanjutkan, Anda menyetujui{' '}
          <Link href="#" sx={{ color: 'inherit', fontWeight: 500 }}>
            Syarat Layanan
          </Link>{' '}
          dan{' '}
          <Link href="#" sx={{ color: 'inherit', fontWeight: 500 }}>
            Kebijakan Privasi
          </Link>
          .
        </Typography>

        {/* Footer */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center" 
          sx={{ 
            display: 'block', 
            mt: 2 
          }}
        >
          Sistem Kasir v1.0 &copy; {new Date().getFullYear()}
        </Typography>

      

        <ToastContainer position="top-right" autoClose={2000} />
      </Paper>
    </Box>
  );
}