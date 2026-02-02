import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  AppBar,
  Toolbar,
  Typography,
  Button,
  alpha,
  Chip,
  useTheme,
  Paper,
  Avatar,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
  Badge
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  Store,
  People,
  Assessment,
  Category,
  Dashboard as DashboardIcon,
  Logout,
  PointOfSale,
  ReceiptLong,
  History,
  SupervisorAccount,
  MonetizationOn,
  ListAlt,
  AddBusiness,
  Menu as MenuIcon,
  Person,
  Settings,
  Notifications
} from "@mui/icons-material";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { io } from "socket.io-client";

const drawerWidth = 280;
const PRIMARY_COLOR = "#9588e8";
const PRIMARY_LIGHT = alpha("#9588e8", 0.1);
const PRIMARY_DARK = "#7a6de5";

// Komponen Notifikasi - VERSI DIPERBAIKI
const NotificationBell = ({ 
  notificationCount, 
  onNotificationClick,
  notifications,
  onMarkAllAsRead
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  // Update local state ketika props berubah
  useEffect(() => {
    setLocalNotifications(notifications);
    setLocalUnreadCount(notificationCount);
  }, [notifications, notificationCount]);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    
    // Reset counter saat dropdown dibuka
    setLocalUnreadCount(0);
    
    // Panggil parent untuk update count
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    if (onMarkAllAsRead) {
      await onMarkAllAsRead();
    }
    setLocalUnreadCount(0);
    handleClose();
  };

  // Filter notifikasi hanya dari hari ini
  const getTodayNotifications = () => {
    const today = new Date();
    const todayString = today.toDateString();
    
    return localNotifications.filter(notification => {
      const notificationDate = new Date(notification.created_at || notification.rawDate || Date.now());
      return notificationDate.toDateString() === todayString;
    });
  };

  // Format tanggal untuk display
  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    
    // Format untuk hari ini
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format tanggal lengkap
  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const todayNotifications = getTodayNotifications();

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: alpha(PRIMARY_COLOR, 0.1),
            color: PRIMARY_COLOR,
          }
        }}
      >
        <Badge
          badgeContent={localUnreadCount > 0 ? localUnreadCount : 0}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: { xs: '0.6rem', md: '0.7rem' },
              height: { xs: 16, md: 18 },
              minWidth: { xs: 16, md: 18 },
              fontWeight: 'bold',
            }
          }}
        >
          <Notifications sx={{ fontSize: { xs: 22, md: 24 } }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 500,
            borderRadius: 2,
            overflow: 'hidden',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header Notifikasi */}
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${alpha('#e0e0e0', 0.5)}`,
          bgcolor: alpha(PRIMARY_COLOR, 0.05)
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="600">
              Notifikasi Hari Ini
            </Typography>
            {localUnreadCount > 0 && (
              <Chip 
                label={`${localUnreadCount} baru`}
                color="error"
                size="small"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Typography>
        </Box>

        {/* List Notifikasi dengan Scroll */}
        <Box sx={{ 
          maxHeight: 350, 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(PRIMARY_COLOR, 0.05),
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(PRIMARY_COLOR, 0.2),
            borderRadius: '3px',
          }
        }}>
          {todayNotifications.length > 0 ? (
            <>
              {todayNotifications.slice(0, 10).map((notification, index) => (
                <React.Fragment key={notification.id_notif || notification.id}>
                  <MenuItem 
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      borderLeft: notification.is_read === 1 ? 'none' : `3px solid ${PRIMARY_COLOR}`,
                      backgroundColor: notification.is_read === 1 ? 'transparent' : alpha(PRIMARY_COLOR, 0.03),
                      '&:hover': {
                        backgroundColor: alpha(PRIMARY_COLOR, 0.08),
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%',
                        bgcolor: notification.is_read === 1 ? 'text.disabled' : PRIMARY_COLOR,
                        mt: 0.8,
                        flexShrink: 0
                      }} />
                      <Box sx={{ flex: 1 }}>
                        {notification.judul && (
                          <Typography 
                            variant="subtitle2" 
                            fontWeight="600"
                            sx={{ mb: 0.5 }}
                          >
                            {notification.judul}
                          </Typography>
                        )}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: notification.is_read === 1 ? 'text.secondary' : 'text.primary',
                            lineHeight: 1.4,
                            fontSize: '0.85rem'
                          }}
                        >
                          {notification.pesan || notification.message}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 2 }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {formatNotificationTime(notification.created_at)}
                      </Typography>
                      {notification.is_read !== 1 && (
                        <Chip 
                          label="Baru"
                          size="small"
                          sx={{ 
                            height: 16,
                            fontSize: '0.6rem',
                            bgcolor: alpha(PRIMARY_COLOR, 0.1),
                            color: PRIMARY_COLOR
                          }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                  {index < todayNotifications.length - 1 && index < 9 && (
                    <Divider sx={{ mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
              
              {todayNotifications.length > 10 && (
                <Box sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    +{todayNotifications.length - 10} notifikasi lainnya hari ini
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 40, color: alpha('#000', 0.2), mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Tidak ada notifikasi hari ini
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer dengan Action Buttons */}
        <Box sx={{ 
          p: 1.5, 
          borderTop: `1px solid ${alpha('#e0e0e0', 0.5)}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1
        }}>
          <Button 
            component={Link}
            to="/allnotifications"
            onClick={handleClose}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontSize: '0.8rem',
              color: PRIMARY_COLOR,
              '&:hover': {
                bgcolor: alpha(PRIMARY_COLOR, 0.05)
              }
            }}
          >
            Lihat Semua
          </Button>
          
          {todayNotifications.some(n => n.is_read !== 1) && (
            <Button 
              onClick={handleMarkAllAsRead}
              size="small"
              sx={{ 
                textTransform: 'none',
                fontSize: '0.8rem',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: alpha('#000', 0.05)
                }
              }}
            >
              Tandai Semua Dibaca
            </Button>
          )}
        </Box>
      </Menu>
    </>
  );
};

// Komponen Avatar User
const UserAvatar = ({ username, userRole, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const goToSettings = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return PRIMARY_COLOR;
    
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#607d8b'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const getRoleName = (role) => {
    switch (role) {
      case 0: return "Super Admin";
      case 1: return "Admin Toko";
      case 2: return "Kasir";
      case 3: return "Admin Perusahaan";
      default: return "User";
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          p: 0.5,
          '&:hover': {
            backgroundColor: alpha(PRIMARY_COLOR, 0.1),
          }
        }}
      >
        <Avatar
          sx={{
            width: { xs: 36, md: 40 },
            height: { xs: 36, md: 40 },
            bgcolor: getAvatarColor(username),
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', md: '1rem' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: `2px solid ${alpha(PRIMARY_COLOR, 0.2)}`,
          }}
        >
          {getInitials(username)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{ py: 1, px: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {username || "Admin"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getRoleName(userRole)}
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={goToProfile} sx={{ py: 1 }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        
        <MenuItem onClick={goToSettings} sx={{ py: 1 }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default function SidebarLayout() {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [lastOpened, setLastOpened] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  // Fetch data user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        const dataUser = res.data.user;

        setUser(dataUser);
        setUsername(dataUser.username);
        setUserRole(dataUser.id_level);

        if (dataUser.id_level !== 0) {
          setCompanyName(dataUser.nama_perusahaan || "Perusahaan Anda");
        } else {
          setCompanyName("TOKO KITA");
        }

      } catch (err) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch notifikasi
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifikasi", { withCredentials: true });
      if (res.data && Array.isArray(res.data)) {
        // Format notifikasi sesuai struktur tabel
        const formattedNotifications = res.data.map(n => ({
          id_notif: n.id_notif,
          user_id: n.user_id,
          id_level: n.id_level,
          id_perusahaan: n.id_perusahaan,
          id_toko: n.id_toko,
          judul: n.judul,
          pesan: n.pesan,
          is_read: n.is_read,
          created_at: n.created_at,
          rawDate: n.created_at
        }));
        
        setNotifications(formattedNotifications);
        
        // Hitung notifikasi yang belum dibaca dan created after last opened
        let unreadCount = 0;
        if (lastOpened) {
          const lastOpenedDate = new Date(lastOpened);
          unreadCount = formattedNotifications.filter(n => 
            n.is_read !== 1 && new Date(n.created_at) > lastOpenedDate
          ).length;
        } else {
          unreadCount = formattedNotifications.filter(n => n.is_read !== 1).length;
        }
        
        setNotificationCount(unreadCount);
      }
    } catch (err) {
      console.error("Error fetch notif:", err);
    }
  };

  // Handle ketika notifikasi diklik
  const handleNotificationClick = async () => {
    // Set waktu terakhir dibuka
    const now = new Date();
    setLastOpened(now.toISOString());
    
    // Reset count ke 0
    setNotificationCount(0);
    
    // Tandai semua notifikasi hari ini sebagai dibaca
    try {
      const today = new Date().toDateString();
      const todayNotifications = notifications.filter(n => {
        const notifDate = new Date(n.created_at).toDateString();
        return notifDate === today && n.is_read !== 1;
      });
      
      for (const notif of todayNotifications) {
        await api.put(`/notifikasi/${notif.id_notif}/read`, {}, { withCredentials: true });
      }
      
      // Update local state
      setNotifications(prev => prev.map(n => ({
        ...n,
        is_read: new Date(n.created_at).toDateString() === today ? 1 : n.is_read
      })));
      
    } catch (err) {
      console.error("Error marking today's notifications as read:", err);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      // Tandai semua notifikasi sebagai dibaca di backend
      await api.put("/notifikasi/mark-all-read", {}, { withCredentials: true });
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setNotificationCount(0);
      
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Socket useEffect
  useEffect(() => {
    if (!user) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      const registerData = {
        id_user: user.id,
        id_level: user.id_level,
        id_perusahaan: user.id_perusahaan,
        id_toko: user.id_toko,
      };
      socket.emit("register", registerData);
    });

    socket.on("notification", (notif) => {
      console.log("📢 New notification received:", notif);
      
      const newNotification = {
        id_notif: notif.id_notif || notif.id,
        user_id: notif.user_id || user.id,
        id_level: notif.id_level || user.id_level,
        id_perusahaan: notif.id_perusahaan || user.id_perusahaan,
        id_toko: notif.id_toko || user.id_toko,
        judul: notif.judul || "Notifikasi Baru",
        pesan: notif.pesan || notif.message || notif.body,
        is_read: 0, // Selalu baru masuk, jadi belum dibaca
        created_at: notif.created_at || new Date().toISOString(),
        rawDate: notif.created_at || new Date().toISOString()
      };
      
      // Tambahkan ke notifications
      setNotifications(prev => [newNotification, ...prev]);
      
      // Update counter jika notifikasi masuk setelah dropdown terakhir dibuka
      const now = new Date();
      if (lastOpened) {
        const lastOpenedDate = new Date(lastOpened);
        if (new Date(newNotification.created_at) > lastOpenedDate) {
          setNotificationCount(prev => prev + 1);
        }
      } else {
        // Jika belum pernah dibuka, tambah counter
        setNotificationCount(prev => prev + 1);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, lastOpened]);


  // Menu configuration (sama seperti sebelumnya)
  const menusByRole = {
    // 🏢 ADMIN PERUSAHAAN
    3: [
      {
        section: "Main",
        items: [
          { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard-adminperusahaan" },
          { label: "Profile", icon: <Store />, path: "/company-profile" },
        ]
      },
      {
        section: "Master Data",
        items: [
          { label: "Tambah Toko", icon: <AddBusiness />, path: "/addtoko" },
          { label: "Tambah Admin", icon: <SupervisorAccount />, path: "/addadmin" },
          { label: "Tambah Supplier", icon: <Store />, path: "/addsupplier" },
          { label: "Manajemen", icon: <Category />, path: "/addkks" },
          { label: "Tambah Barang", icon: <Inventory />, path: "/addbarang" },
          { label: "Keterangan", icon: <ListAlt />, path: "/keterangan" },
        ]
      },
      {
        section: "Laporan",
        items: [
          { label: "Laporan", icon: <Assessment />, path: "/laporan" },
        ]
      }
    ],

    // 🧾 ADMIN TOKO
    1: [
      {
        section: "Main",
        items: [
          { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard-admin" },
          { label: "Barang", icon: <Inventory />, path: "/barang" },
        ]
      },
      {
        section: "Transaksi",
        items: [
          { label: "Pembelian", icon: <ShoppingCart />, path: "/addpembelian" },
          { label: "Penjualan", icon: <PointOfSale />, path: "/penjualan" },
          { label: "Riwayat Pembelian", icon: <ReceiptLong />, path: "/daftar-pembelian" },
          { label: "Riwayat Penjualan", icon: <History />, path: "/riwayat-penjualan" },
        ]
      },
      {
        section: "Manajemen",
        items: [
          { label: "Laporan", icon: <History />, path: "/laporan-keuangan-toko"},
          { label: "Tambah Kasir", icon: <People />, path: "/addkasir" },
        ]
      }
    ],

    // 💵 KASIR
    2: [
      {
        section: "",
        items: [
          { label: "Transaksi", icon: <PointOfSale />, path: "/transaksi" },
          { label: "Riwayat Transaksi", icon: <History />, path: "/riwayat_transaksi" },
        ]
      },
    ],

    // 🌍 SUPER ADMIN
    0: [
      {
        section: "Main",
        items: [
          { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboardsuperadmin" },
        ]
      },
      {
        section: "Manajemen",
        items: [
          { label: "Daftar Users", icon: <People />, path: "/users" },
          { label: "Daftar Perusahaan", icon: <Store />, path: "/perusahaan-list" },
          { label: "Daftar Pembayaran", icon: <MonetizationOn />, path: "/pembayaran-list" },
          { label: "Paket Langganan", icon: <Assessment />, path: "/subscription-plans" },
        ]
      }
    ]
  };

  const menus = menusByRole[userRole] || [];

  const getActiveMenuLabel = () => {
    let allItems = [];
    menus.forEach(menu => {
      if (menu.items) {
        allItems = [...allItems, ...menu.items];
      } else {
        allItems.push(menu);
      }
    });
    const activeMenu = allItems.find(item => location.pathname.startsWith(item.path));
    return activeMenu ? activeMenu.label : "Dashboard";
  };

  const drawer = (
    <>
      {/* Sidebar Header */}
      <Toolbar sx={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90px !important",
        background: "white",
        borderBottom: `1px solid ${alpha('#9588e8', 0.1)}`
      }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="700" sx={{ 
            color: PRIMARY_COLOR,
            mb: 0.5,
            fontSize: { xs: "1.1rem", md: "1.25rem" }
          }}>
            {userRole === 0 ? "TOKO KITA" : companyName}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: alpha("#2c2c2c", 0.7),
            fontWeight: 500,
            fontSize: { xs: "0.7rem", md: "0.75rem" }
          }}>
            Management System
          </Typography>
        </Box>
      </Toolbar>
      
      {/* Navigation Menu */}
      <List sx={{ px: { xs: 1, md: 2 }, mt: 2, flex: 1 }}>
        {menus.map((section, sIdx) => (
          <Box key={sIdx} sx={{ mb: 2 }}>
            <ListSubheader
              disableSticky
              sx={{
                bgcolor: "transparent",
                color: alpha("#2c2c2c", 0.6),
                fontWeight: 700,
                fontSize: { xs: "0.75rem", md: "0.8rem" },
                pl: 0,
                mb: 1
              }}
            >
              {section.section}
            </ListSubheader>

            {section.items.map((menu, idx) => {
              const isActive = location.pathname === menu.path;
              return (
                <ListItem
                  button
                  key={idx}
                  component={Link}
                  to={menu.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    backgroundColor: isActive ? alpha(PRIMARY_COLOR, 0.1) : "transparent",
                    border: isActive ? `1px solid ${PRIMARY_COLOR}` : "1px solid transparent",
                    "&:hover": { 
                      backgroundColor: alpha(PRIMARY_COLOR, 0.05),
                      borderColor: alpha(PRIMARY_COLOR, 0.5),
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.3s ease-in-out",
                    py: { xs: 1, md: 1.25 }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? PRIMARY_COLOR : alpha("#2c2c2c", 0.7),
                    minWidth: { xs: "36px", md: "40px" }
                  }}>
                    {React.cloneElement(menu.icon, {
                      sx: { fontSize: { xs: "1.2rem", md: "1.25rem" } }
                    })}
                  </ListItemIcon>
                  <ListItemText 
                    primary={menu.label} 
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isActive ? "700" : "500",
                        color: isActive ? PRIMARY_COLOR : "#2c2c2c",
                        fontSize: { xs: "0.85rem", md: "0.95rem" }
                      }
                    }}
                  />
                  {isActive && (
                    <Box 
                      sx={{ 
                        width: 4, 
                        height: 20, 
                        bgcolor: PRIMARY_COLOR,
                        borderRadius: 2,
                        ml: 1
                      }} 
                    />
                  )}
                </ListItem>
              );
            })}
          </Box>
        ))}
      </List>
    </>
  );

   return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "white" }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: "white",
            color: "#2c2c2c",
            border: "none",
            boxShadow: "4px 0 16px rgba(149, 136, 232, 0.1)",
            borderRight: `1px solid ${alpha('#9588e8', 0.1)}`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "white",
            color: "#2c2c2c",
            border: "none",
            boxShadow: "4px 0 16px rgba(149, 136, 232, 0.1)",
            borderRight: `1px solid ${alpha('#9588e8', 0.1)}`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="static"
          sx={{ 
            bgcolor: "white", 
            color: "#2c2c2c",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderBottom: `1px solid ${alpha('#e0e0e0', 0.5)}`,
          }}
          elevation={0}
        >
          <Toolbar sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            minHeight: { xs: "70px !important", md: "80px !important" },
            px: { xs: 2, md: 3 }
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  display: { md: 'none' },
                  color: PRIMARY_COLOR
                }}
              >
                <MenuIcon />
              </IconButton>
              
              <Box>
                <Typography variant="h5" fontWeight="700" sx={{ 
                  color: "#2c2c2c",
                  mb: 0.5,
                  fontSize: { xs: "1.25rem", md: "1.5rem" }
                }}>
                  {getActiveMenuLabel()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{
                  fontSize: { xs: "0.7rem", md: "0.75rem" }
                }}>
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
              {/* Tombol Notifikasi */}
              <NotificationBell 
                notificationCount={notificationCount}
                onNotificationClick={handleNotificationClick}
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
              />

              {/* Avatar User */}
              <UserAvatar 
                username={username}
                userRole={userRole}
                onMenuOpen={() => {}} // placeholder
                onLogout={handleLogout}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Container */}
        <Box sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 } }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: `1px solid ${alpha('#e0e0e0', 0.5)}`,
              minHeight: "auto",
              p: { xs: 2, sm: 3, md: 4 },
              overflowX: "auto",
            }}
          >
            <Outlet />
          </Paper>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          py: { xs: 1.5, md: 2 }, 
          px: { xs: 2, md: 3 }, 
          bgcolor: "white", 
          borderTop: `1px solid ${alpha('#e0e0e0', 0.5)}`,
          textAlign: "center"
        }}>
          <Typography variant="caption" color="text.secondary" sx={{
            fontSize: { xs: "0.7rem", md: "0.75rem" }
          }}>
            © {new Date().getFullYear()} Toko Kita Management System • 
            <span style={{ color: PRIMARY_COLOR, fontWeight: 600, marginLeft: 4 }}>
              Powered by Arya
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}