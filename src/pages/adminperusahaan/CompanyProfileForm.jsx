import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Card,
  CardContent,
  alpha,
  IconButton,
  InputAdornment,
  Chip,
  Fade,
  Container,
  Paper,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Divider
} from "@mui/material";
import {
  Business,
  Edit,
  Save,
  Cancel,
  LocationOn,
  Phone,
  Email,
  Public,
  CalendarToday,
  Warning,
  CheckCircle,
  Payment,
  Info,
  Lock
} from "@mui/icons-material";
import api from "../../api";
import ChangePasswordForm from "../../components/ChangePasswordForm";

// Warna palette
const BLACK = "#000000";
const WHITE = "#ffffff";
const GRAY_DARK = "#424242";
const GRAY_MEDIUM = "#757575";
const GRAY_LIGHT = "#bdbdbd";
const PURPLE = "#9588e8";
const PURPLE_LIGHT = alpha("#9588e8", 0.1);
const PURPLE_DARK = "#7a6de5";
const GREEN = "#4caf50";
const RED = "#f44336";
const ORANGE = "#ff9800";

export default function CompanyProfile() {
  const [profile, setProfile] = useState({
    nama_perusahaan: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    status: "inactive",
    tanggal_berlangganan: null,
    tanggal_kedaluwarsa: null
  });
  const [isEdit, setIsEdit] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await api.get("/company/profile");
        if (res.data) {
          setProfile({
            nama_perusahaan: res.data.nama_perusahaan || "",
            alamat: res.data.alamat || "",
            telepon: res.data.telepon || "",
            email: res.data.email || "",
            website: res.data.website || "",
            status: res.data.status || "inactive",
            tanggal_berlangganan: res.data.tanggal_berlangganan,
            tanggal_kedaluwarsa: res.data.tanggal_kedaluwarsa
          });
        }
      } catch (err) {
        console.log("Belum ada data perusahaan");
        setErr("Belum ada data perusahaan. Silakan lengkapi profil Anda.");
      } finally {
        setLoading(false);
        setTimeout(() => setAnimateIn(true), 300);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setSaveLoading(true);
    
    try {
      await api.post("/company/update", profile);
      setSuccess("Profil perusahaan berhasil diperbarui!");
      setTimeout(() => setIsEdit(false), 1500);
    } catch (err) {
      setErr(err.response?.data?.message || "Gagal menyimpan profil");
    } finally {
      setSaveLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setErr("");
    setSuccess("");
  };

  const handleSubscribe = () => {
    navigate("/petunjuk-pembayaran");
  };

  const handleOpenChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          color: GREEN,
          icon: <CheckCircle />,
          label: 'Aktif',
          description: 'Akun Anda aktif dan dapat menggunakan semua fitur'
        };
      case 'expired':
        return {
          color: RED,
          icon: <Warning />,
          label: 'Kedaluwarsa',
          description: 'Masa langganan telah habis'
        };
      case 'suspended':
        return {
          color: RED,
          icon: <Warning />,
          label: 'Ditangguhkan',
          description: 'Akun Anda ditangguhkan sementara'
        };
      case 'pending':
        return {
          color: ORANGE,
          icon: <Info />,
          label: 'Menunggu Verifikasi',
          description: 'Pembayaran sedang diverifikasi'
        };
      default:
        return {
          color: GRAY_MEDIUM,
          icon: <Info />,
          label: 'Belum Berlangganan',
          description: 'Silakan berlangganan untuk mengaktifkan akun'
        };
    }
  };

  const statusConfig = getStatusConfig(profile.status);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Komponen InfoField yang diperbaiki
  const InfoField = ({ icon, label, value, fieldName, editable = true }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Box
        sx={{
          backgroundColor: PURPLE_LIGHT,
          borderRadius: '12px',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color={GRAY_MEDIUM} fontWeight="600" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {isEdit && editable ? (
          <TextField
            fullWidth
            size="small"
            name={fieldName} // Gunakan fieldName yang konsisten
            value={value}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        ) : (
          <Typography variant="body1" color={BLACK} fontWeight="500">
            {value || "Belum diatur"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: PURPLE }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in={animateIn} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            fontWeight="700"
            sx={{
              mb: 2,
              background: `linear-gradient(45deg, ${BLACK} 30%, ${PURPLE} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Profil Perusahaan
          </Typography>
          <Typography variant="body1" color={GRAY_MEDIUM}>
            Kelola informasi dan status langganan perusahaan Anda
          </Typography>
        </Box>
      </Fade>

      <Fade in={animateIn} timeout={1200}>
        <Card 
          sx={{
            borderRadius: 3,
            background: WHITE,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${alpha(GRAY_LIGHT, 0.3)}`,
            overflow: 'visible'
          }}
        >
          {/* Status Section */}
          <Box 
            sx={{ 
              background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`,
              color: WHITE,
              p: 3,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Status Langganan
                </Typography>
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  sx={{
                    bgcolor: alpha(WHITE, 0.2),
                    color: WHITE,
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: WHITE }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  {statusConfig.description}
                </Typography>
              </Box>
              
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: WHITE,
                  color: PURPLE,
                  border: `3px solid ${alpha(WHITE, 0.3)}`,
                }}
              >
                <Business sx={{ fontSize: 32 }} />
              </Avatar>
            </Stack>

            {/* Subscription Info */}
            {(profile.status === 'active' || profile.status === 'expired') && (
              <Paper 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: alpha(WHITE, 0.1),
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Mulai Berlangganan
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatDate(profile.tanggal_berlangganan)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Berakhir Pada
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatDate(profile.tanggal_kedaluwarsa)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Action Buttons */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="600" color={BLACK}>
                Informasi Perusahaan
              </Typography>
              
              <Stack direction="row" spacing={1}>
                {!isEdit && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Lock />}
                      onClick={handleOpenChangePassword}
                      sx={{
                        borderRadius: 2,
                        borderColor: GRAY_MEDIUM,
                        color: GRAY_DARK,
                        '&:hover': {
                          borderColor: BLACK,
                          bgcolor: alpha(BLACK, 0.02)
                        }
                      }}
                    >
                      Ubah Password
                    </Button>
                    {profile.status !== 'active' && (
                      <Button
                        variant="contained"
                        startIcon={<Payment />}
                        onClick={handleSubscribe}
                        sx={{
                          borderRadius: 2,
                          bgcolor: GREEN,
                          '&:hover': { bgcolor: '#388e3c' }
                        }}
                      >
                        Berlangganan
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setIsEdit(true)}
                      sx={{
                        borderRadius: 2,
                        borderColor: PURPLE,
                        color: PURPLE,
                        '&:hover': {
                          borderColor: PURPLE_DARK,
                          bgcolor: PURPLE_LIGHT
                        }
                      }}
                    >
                      Edit Profil
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>

            {err && (
              <Alert 
                severity="error"
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                }}
              >
                {err}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success"
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                }}
              >
                {success}
              </Alert>
            )}

            {/* Profile Form */}
            <Box component="form" onSubmit={submit}>
              <InfoField
                icon={<Business sx={{ color: PURPLE, fontSize: 20 }} />}
                label="Nama Perusahaan"
                value={profile.nama_perusahaan}
                fieldName="nama_perusahaan" // Gunakan nama field yang sesuai dengan state
              />

              <InfoField
                icon={<LocationOn sx={{ color: PURPLE, fontSize: 20 }} />}
                label="Alamat"
                value={profile.alamat}
                fieldName="alamat"
              />

              <InfoField
                icon={<Phone sx={{ color: PURPLE, fontSize: 20 }} />}
                label="Telepon"
                value={profile.telepon}
                fieldName="telepon"
              />

              <InfoField
                icon={<Email sx={{ color: PURPLE, fontSize: 20 }} />}
                label="Email"
                value={profile.email}
                fieldName="email"
              />

              {/* Tambahkan field website jika diperlukan */}
              <InfoField
                icon={<Public sx={{ color: PURPLE, fontSize: 20 }} />}
                label="Website"
                value={profile.website}
                fieldName="website"
              />

              {/* Action Buttons for Edit Mode */}
              {isEdit && (
                <Fade in={isEdit}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4, pt: 2, borderTop: `1px solid ${alpha(GRAY_LIGHT, 0.3)}` }}>
                    <Button
                      onClick={cancelEdit}
                      startIcon={<Cancel />}
                      variant="outlined"
                      disabled={saveLoading}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={saveLoading ? <CircularProgress size={16} sx={{ color: WHITE }} /> : <Save />}
                      disabled={saveLoading}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        bgcolor: PURPLE,
                        '&:hover': { bgcolor: PURPLE_DARK },
                      }}
                    >
                      {saveLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </Stack>
                </Fade>
              )}
            </Box>

            {/* Subscription Call to Action */}
            {profile.status !== 'active' && !isEdit && (
              <Paper
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: alpha(ORANGE, 0.05),
                  border: `1px solid ${alpha(ORANGE, 0.2)}`,
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Warning sx={{ color: ORANGE, fontSize: 40, mb: 2 }} />
                <Typography variant="h6" color={ORANGE} gutterBottom>
                  Aktifkan Akun Anda
                </Typography>
                <Typography variant="body2" color={GRAY_MEDIUM} sx={{ mb: 2 }}>
                  Untuk dapat menggunakan semua fitur sistem, silakan berlangganan terlebih dahulu.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Payment />}
                  onClick={handleSubscribe}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    bgcolor: ORANGE,
                    '&:hover': { bgcolor: '#f57c00' }
                  }}
                >
                  Berlangganan Sekarang
                </Button>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Fade>

      {/* Modal Change Password */}
      <ChangePasswordForm 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)} 
      />
    </Container>
  );
}