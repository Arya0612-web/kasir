import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Button,
  Chip,
  alpha,
  useTheme
} from "@mui/material";
import {
  Notifications,
  ArrowBack,
  CheckCircle,
  Cancel,
  Payment,
  Store,
  Assignment,
  Schedule,
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const PRIMARY_COLOR = "#9588e8";

// Ikon berdasarkan tipe notifikasi
const getNotificationIcon = (message) => {
  if (message.toLowerCase().includes('ditolak')) return <Cancel />;
  if (message.toLowerCase().includes('pembayaran')) return <Payment />;
  if (message.toLowerCase().includes('langganan') || message.toLowerCase().includes('plan')) return <Assignment />;
  if (message.toLowerCase().includes('perusahaan')) return <Store />;
  return <Notifications />;
};

// Warna berdasarkan tipe notifikasi
const getNotificationColor = (message) => {
  if (message.toLowerCase().includes('ditolak')) return '#f44336';
  if (message.toLowerCase().includes('pembayaran')) return '#4caf50';
  if (message.toLowerCase().includes('langganan')) return '#2196f3';
  if (message.toLowerCase().includes('diajukan')) return '#ff9800';
  return PRIMARY_COLOR;
};

// Status badge
const getStatusBadge = (message) => {
  if (message.toLowerCase().includes('ditolak')) return 'Ditolak';
  if (message.toLowerCase().includes('diajukan')) return 'Pengajuan';
  if (message.toLowerCase().includes('berhasil')) return 'Berhasil';
  return 'Info';
};

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch user data dan notifikasi
  useEffect(() => {
    fetchUserData();
    fetchAllNotifications();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      if (res.data && res.data.user) {
        setUserRole(res.data.user.id_level);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Fungsi untuk menentukan dashboard berdasarkan role
  const getDashboardPath = () => {
    switch (userRole) {
      case 0: // Super Admin
        return "/dashboardsuperadmin";
      case 1: // Admin Toko
        return "/dashboard-admin";
      case 2: // Kasir
        return "/transaksi"; // Kasir biasanya langsung ke transaksi
      case 3: // Admin Perusahaan
        return "/dashboard-adminperusahaan";
      default:
        return "/dashboard";
    }
  };

  // Fungsi untuk mendapatkan nama dashboard berdasarkan role
  const getDashboardName = () => {
    switch (userRole) {
      case 0:
        return "Dashboard Super Admin";
      case 1:
        return "Dashboard Admin Toko";
      case 2:
        return "Dashboard Kasir";
      case 3:
        return "Dashboard Admin Perusahaan";
      default:
        return "Dashboard";
    }
  };

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifikasi", { withCredentials: true });
      if (res.data && Array.isArray(res.data)) {
        const formattedNotifications = res.data.map(n => ({
          id: n.id,
          message: n.pesan || n.body || n.message || "Notifikasi",
          read: n.is_read === 1 || n.read || false,
          time: new Date(n.created_at || n.time).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
            year: "numeric"
          }),
          fullDate: new Date(n.created_at || n.time),
          rawDate: n.created_at || n.time
        }));
        
        // Urutkan berdasarkan tanggal terbaru
        formattedNotifications.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
        setNotifications(formattedNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk tandai sudah dibaca
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifikasi/${notificationId}/read`, {}, { withCredentials: true });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Fungsi untuk tandai semua sudah dibaca
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await api.put(`/notifikasi/${notification.id}/read`, {}, { withCredentials: true });
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Kelompokkan notifikasi berdasarkan tanggal
  const groupNotificationsByDate = () => {
    const groups = {};
    notifications.forEach(notification => {
      const date = new Date(notification.rawDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return groups;
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${alpha('#e0e0e0', 0.5)}`,
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          bgcolor: alpha(PRIMARY_COLOR, 0.08),
          borderBottom: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton 
              onClick={() => navigate(getDashboardPath())}
              sx={{ 
                color: PRIMARY_COLOR,
                '&:hover': { bgcolor: alpha(PRIMARY_COLOR, 0.1) }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="700">
                Semua Notifikasi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notifications.length} total notifikasi • {getDashboardName()}
              </Typography>
            </Box>
            
            <Chip 
              icon={<DashboardIcon />}
              label={getDashboardName().replace("Dashboard ", "")}
              size="small"
              sx={{ 
                bgcolor: alpha(PRIMARY_COLOR, 0.1),
                color: PRIMARY_COLOR,
                fontWeight: 600
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              icon={<Notifications />}
              label={`${notifications.filter(n => !n.read).length} belum dibaca`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<CheckCircle />}
              onClick={markAllAsRead}
              disabled={notifications.filter(n => !n.read).length === 0}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Tandai Semua Dibaca
            </Button>
          </Box>
        </Box>

        {/* Konten Notifikasi */}
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Memuat notifikasi...</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 60, color: alpha('#000', 0.1), mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tidak ada notifikasi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Semua notifikasi akan muncul di sini
              </Typography>
            </Box>
          ) : (
            Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <Box key={date}>
                {/* Header Tanggal */}
                <Box sx={{ 
                  p: 2, 
                  bgcolor: alpha('#000', 0.02),
                  borderBottom: `1px solid ${alpha('#000', 0.05)}`
                }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    {date}
                  </Typography>
                </Box>

                {/* List Notifikasi per Tanggal */}
                <List disablePadding>
                  {dateNotifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{ 
                          px: 3,
                          py: 2,
                          cursor: 'pointer',
                          bgcolor: notification.read ? 'transparent' : alpha(PRIMARY_COLOR, 0.03),
                          '&:hover': {
                            bgcolor: notification.read ? alpha('#000', 0.02) : alpha(PRIMARY_COLOR, 0.05),
                          },
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(getNotificationColor(notification.message), 0.1),
                              color: getNotificationColor(notification.message)
                            }}
                          >
                            {getNotificationIcon(notification.message)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: notification.read ? 400 : 600,
                                  flex: 1
                                }}
                              >
                                {notification.message}
                              </Typography>
                              <Chip 
                                label={getStatusBadge(notification.message)}
                                size="small"
                                sx={{ 
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: alpha(getNotificationColor(notification.message), 0.1),
                                  color: getNotificationColor(notification.message),
                                  border: 'none'
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {notification.time}
                              </Typography>
                              {!notification.read && (
                                <Box 
                                  sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%',
                                    bgcolor: PRIMARY_COLOR,
                                    ml: 1
                                  }} 
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dateNotifications.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ))
          )}
        </Box>

        {/* Footer dengan tombol kembali ke dashboard yang sesuai */}
        {/* <Box sx={{ 
          p: 2, 
          textAlign: 'center',
          borderTop: `1px solid ${alpha('#000', 0.05)}`,
          bgcolor: alpha('#000', 0.01)
        }}>
          <Button 
            onClick={() => navigate(getDashboardPath())}
            startIcon={<ArrowBack />}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              bgcolor: PRIMARY_COLOR,
              '&:hover': {
                bgcolor: PRIMARY_COLOR,
              },
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Kembali ke {getDashboardName()}
          </Button>
        </Box> */}
      </Paper>
    </Container>
  );
};

export default AllNotifications;