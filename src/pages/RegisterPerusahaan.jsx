import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Link,
  Container,
  Grid,
  Fade
} from "@mui/material";
import { Person, Lock, Email, Business, Visibility, VisibilityOff } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPerusahaan() {
  const [form, setForm] = useState({
    nama_user: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.nama_user || !form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.warn("Semua field wajib diisi");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Format email tidak valid");
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register-perusahaan", {
        nama_user: form.nama_user,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (res.data?.success) {
        toast.success("Akun berhasil dibuat. Silakan cek email Anda untuk verifikasi.");
        setTimeout(() => navigate("/verifikasi-email"), 2000);
      } else {
        toast.warn(res.data?.message || "Pendaftaran berhasil, tapi email gagal dikirim.");
      }
    } catch (err) {
      console.error("❌ Error dari server:", err.response?.data || err.message);
      
      const errorMessage = err.response?.data?.message || err.message;
      
      // Handle specific error messages from backend
      if (errorMessage.includes("Email sudah terdaftar")) {
        toast.error(
          <div>
            <strong>Email sudah terdaftar!</strong>
            <br />
            Email <strong>{form.email}</strong> sudah digunakan.
            <br />
            Gunakan email lain atau <Link 
              component="button" 
              type="button"
              onClick={() => navigate("/login")}
              sx={{ 
                color: '#2c2c2c', 
                fontWeight: '600',
                textDecoration: 'underline',
                fontSize: '0.8rem',
                p: 0,
                minWidth: 'auto'
              }}
            >
              login di sini
            </Link>
          </div>,
          { 
            autoClose: 6000,
            position: "top-center"
          }
        );
      } else if (errorMessage.includes("Username sudah terdaftar")) {
        toast.error(
          <div>
            <strong>Username sudah terdaftar!</strong>
            <br />
            Username <strong>"{form.username}"</strong> sudah digunakan.
            <br />
            Silakan pilih username lain.
          </div>,
          { 
            autoClose: 5000,
            position: "top-center"
          }
        );
      } else if (errorMessage.includes("Semua field wajib diisi")) {
        toast.error("Semua field wajib diisi!", { autoClose: 4000 });
      } else {
        toast.error(
          <div>
            <strong>Gagal registrasi!</strong>
            <br />
            {errorMessage}
          </div>,
          { autoClose: 5000 }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Fade in={true} timeout={800}>
          <Grid 
            container 
            sx={{ 
              height: '100%', 
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Form Column - Ditengah */}
            <Grid item xs={12} md={6} lg={5}>
              <Box 
                sx={{ 
                  width: '100%',
                  margin: '0 auto',
                  p: { xs: 3, sm: 4 },
                  background: '#ffffff',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Header - Selalu di tengah */}
                <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
                  
                  <Typography 
                    variant="h4" 
                    fontWeight="600"
                    sx={{
                      color: '#2c2c2c',
                      mb: 1
                    }}
                  >
                    Daftar Akun
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666666',
                    }}
                  >
                    Buat akun perusahaan untuk mengelola sistem
                  </Typography>
                </Box>

                {/* Form */}
                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ 
                    mt: 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Nama Lengkap"
                    name="nama_user"
                    value={form.nama_user}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#757575' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#424242',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2c2c2c',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2c2c2c',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                    placeholder="Pilih username unik"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#757575' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#424242',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2c2c2c',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2c2c2c',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    placeholder="contoh@email.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#757575' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#424242',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2c2c2c',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2c2c2c',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    placeholder="Minimal 6 karakter"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#757575' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={togglePasswordVisibility}
                            sx={{ 
                              minWidth: 'auto', 
                              p: 1,
                              color: '#757575',
                              '&:hover': {
                                background: 'transparent',
                                color: '#2c2c2c'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#424242',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2c2c2c',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2c2c2c',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Konfirmasi Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                    placeholder="Ulangi password Anda"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#757575' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={toggleConfirmPasswordVisibility}
                            sx={{ 
                              minWidth: 'auto', 
                              p: 1,
                              color: '#757575',
                              '&:hover': {
                                background: 'transparent',
                                color: '#2c2c2c'
                              }
                            }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#424242',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2c2c2c',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2c2c2c',
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      mt: 4,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: '600',
                      textTransform: 'none',
                      fontSize: '1rem',
                      background: '#2c2c2c',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(44, 44, 44, 0.2)',
                      '&:hover': {
                        background: '#424242',
                        boxShadow: '0 6px 16px rgba(44, 44, 44, 0.3)',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&:disabled': {
                        background: '#bdbdbd',
                        color: '#ffffff',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                  </Button>
                </Box>

                {/* Footer Links */}
                <Box sx={{ 
                  textAlign: 'center', 
                  mt: 4, 
                  pt: 3, 
                  borderTop: `1px solid ${alpha('#000', 0.1)}`,
                  width: '100%' 
                }}>
                  <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                    Sudah punya akun?
                  </Typography>
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: '#2c2c2c',
                      fontWeight: '600',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: '#424242',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Masuk ke akun Anda
                  </Link>
                </Box>

                {/* Copyright */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#9e9e9e', 
                    textAlign: 'center', 
                    mt: 4,
                    fontSize: '0.75rem',
                    width: '100%'
                  }}
                >
                  Sistem Kasir v1.0 &copy; {new Date().getFullYear()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
}