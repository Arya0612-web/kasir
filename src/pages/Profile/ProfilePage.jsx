import React, { useState, useEffect } from "react"; 

import { 
  Container, 
  Grid, 
  Paper, 
  Box, 
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Fade,
  Button,
  alpha,
  Stack
} from "@mui/material";
import {
  Business as BusinessIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api";

// Components
import ProfileHeader from "./Components/ProfileHeader";
import ProfileInfo from "./Components/ProfileInfo";
import ProfileCompany from "./Components/ProfileCompany";
import ProfileAdminToko from "./Components/ProfileAdminToko";
import ProfileKasir from "./Components/ProfileKasir";
import ProfileSuperadmin from "./Components/ProfileSuperadmin";
import ProfileChangePassword from "./Components/ProfileChangePassword";
import ProfileSettings from "./Components/ProfileSettings";

// Warna palette
const PURPLE = "#9588e8";
const PURPLE_LIGHT = alpha("#9588e8", 0.1);
const GREEN = "#4caf50";
const RED = "#f44336";
const ORANGE = "#ff9800";
const BLUE = "#2196f3";

const menuCards = [
  { 
    id: "info", 
    title: "Informasi Akun", 
    description: "Lihat dan kelola data pribadi Anda",
    icon: <PersonIcon />,
    color: BLUE,
    allLevels: true
  },
  { 
    id: "company", 
    title: "Profil Perusahaan", 
    description: "Kelola informasi perusahaan",
    icon: <BusinessIcon />,
    color: GREEN,
    levels: [3]
  },
  { 
    id: "store", 
    title: "Profil Toko", 
    description: "Kelola data toko Anda",
    icon: <StoreIcon />,
    color: ORANGE,
    levels: [1]
  },
  { 
    id: "cashier", 
    title: "Profil Kasir", 
    description: "Informasi akun kasir",
    icon: <PersonIcon />,
    color: PURPLE,
    levels: [2]
  },
  { 
    id: "superadmin", 
    title: "Pengaturan Sistem", 
    description: "Konfigurasi sistem superadmin",
    icon: <SecurityIcon />,
    color: RED,
    levels: [0]
  },
  { 
    id: "password", 
    title: "Ubah Password", 
    description: "Perbarui kata sandi akun",
    icon: <SecurityIcon />,
    color: "#607D8B",
    allLevels: true
  },
  { 
    id: "settings", 
    title: "Pengaturan", 
    description: "Preferensi dan notifikasi",
    icon: <PersonIcon />,
    color: "#795548",
    allLevels: true
  }
];

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("info");
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const get = async () => {
      try {
        const res = await api.get("/profile");
        setData(res.data);
        
        // Set default menu berdasarkan level
        if (res.data.id_level === 3) setSelectedMenu("company");
        else if (res.data.id_level === 1) setSelectedMenu("store");
        else if (res.data.id_level === 2) setSelectedMenu("cashier");
        else if (res.data.id_level === 0) setSelectedMenu("superadmin");
        
      } catch (err) {
        console.error("Error load profile:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimateIn(true), 300);
      }
    };
    get();
  }, []);

  const getFilteredMenus = () => {
    if (!data) return [];
    return menuCards.filter(menu => 
      menu.allLevels || (menu.levels && menu.levels.includes(data.id_level))
    );
  };

  const renderContent = () => {
    if (!data) return null;
    
    switch (selectedMenu) {
      case "info": 
        return <ProfileInfo data={data} />;
      case "company": 
        return <ProfileCompany data={data} />;
      case "store": 
        return <ProfileAdminToko data={data} />;
      case "cashier": 
        return <ProfileKasir data={data} />;
      case "superadmin": 
        return <ProfileSuperadmin data={data} />;
      case "password": 
        return <ProfileChangePassword />;
      case "settings": 
        return <ProfileSettings data={data} />;
      default: 
        return <ProfileInfo data={data} />;
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          color: GREEN,
          label: 'Aktif',
          description: 'Akun Anda aktif dan dapat menggunakan semua fitur'
        };
      case 'expired':
        return {
          color: RED,
          label: 'Kedaluwarsa',
          description: 'Masa langganan telah habis'
        };
      case 'suspended':
        return {
          color: RED,
          label: 'Ditangguhkan',
          description: 'Akun Anda ditangguhkan sementara'
        };
      case 'pending':
        return {
          color: ORANGE,
          label: 'Menunggu Verifikasi',
          description: 'Pembayaran sedang diverifikasi'
        };
      case 'inactive':
        return {
          color: "#757575",
          label: 'Belum Berlangganan',
          description: 'Silakan berlangganan untuk mengaktifkan akun'
        };
      default:
        return {
          color: "#757575",
          label: 'Tidak Diketahui',
          description: 'Status akun tidak diketahui'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSubscribe = () => {
    navigate("/petunjuk-pembayaran");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: PURPLE }} />
      </Box>
    );
  }

  const filteredMenus = getFilteredMenus();
  const activeMenu = menuCards.find(menu => menu.id === selectedMenu) || menuCards[0];
  const statusConfig = getStatusConfig(data?.user?.status_akun || 'inactive');

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Fade in={animateIn} timeout={800}>
        <Box>
          {/* Header */}
          <ProfileHeader 
            user={data.user} 
            perusahaan={data.perusahaan}
            toko={data.toko}
          />

          {/* Status Info Bar */}
          <Paper 
            elevation={2}
            sx={{ 
              mb: 3,
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${PURPLE_LIGHT} 0%, ${alpha(PURPLE, 0.05)} 100%)`,
              border: `1px solid ${alpha(PURPLE, 0.2)}`
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Status Langganan
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Chip
                    label={statusConfig.label}
                    sx={{
                      bgcolor: statusConfig.color,
                      color: 'white',
                      fontWeight: 600,
                      px: 1
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {statusConfig.description}
                  </Typography>
                </Stack>

                {/* Subscription Dates */}
                {(data.user?.tanggal_berlangganan || data.user?.tanggal_kedaluwarsa) && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Mulai Berlangganan
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(data.user.tanggal_berlangganan)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Berakhir Pada
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(data.user.tanggal_kedaluwarsa)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                {data.user?.status_akun !== 'active' && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PaymentIcon />}
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
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Left Column: Menu Cards */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2, 
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  position: 'sticky',
                  top: 20
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Menu Profil
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Pilih menu untuk mengelola profil Anda
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {filteredMenus.map((menu) => (
                    <Paper
                      key={menu.id}
                      onClick={() => setSelectedMenu(menu.id)}
                      elevation={selectedMenu === menu.id ? 2 : 0}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        border: selectedMenu === menu.id ? `2px solid ${menu.color}` : '1px solid #e0e0e0',
                        bgcolor: selectedMenu === menu.id ? alpha(menu.color, 0.1) : 'white',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                          borderColor: menu.color
                        }
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: 2, 
                            bgcolor: alpha(menu.color, 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {React.cloneElement(menu.icon, { 
                              sx: { color: menu.color, fontSize: 20 }
                            })}
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {menu.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {menu.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Content */}
            <Grid item xs={12} md={8} lg={9}>
              <Fade in={true} timeout={500}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    minHeight: 500
                  }}
                >
                  {/* Content Header */}
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: activeMenu.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(activeMenu.icon, { sx: { fontSize: 28 } })}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={600}>
                        {activeMenu.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {activeMenu.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content Body */}
                  <Box sx={{ p: { xs: 2, md: 4 } }}>
                    {renderContent()}
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
}