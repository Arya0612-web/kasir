import React from "react"; 
import { Card, CardContent, Typography, Stack, Box, Grid, alpha } from "@mui/material";
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Shield as ShieldIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon
} from "@mui/icons-material";

const RED = "#F44336";

const InfoItem = ({ icon, label, value, color = RED }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
    <Box sx={{ 
      backgroundColor: alpha(color, 0.1),
      borderRadius: '12px',
      p: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value || "Belum diatur"}
      </Typography>
    </Box>
  </Box>
);

export default function ProfileSuperadmin({ data }) {
  const u = data.user;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <SecurityIcon color="error" />
          Superadmin Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: RED, mb: 2 }}>
              Informasi Akun
            </Typography>
            
            <InfoItem
              icon={<PersonIcon />}
              label="Nama Lengkap"
              value={u.nama_user}
            />
            
            <InfoItem
              icon={<EmailIcon />}
              label="Email"
              value={u.email}
            />
            
            <InfoItem
              icon={<SecurityIcon />}
              label="Role"
              value="Superadmin"
            />
            
            <InfoItem
              icon={<CalendarIcon />}
              label="Bergabung Sejak"
              value={formatDate(u.created_at)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: "#2196F3", mb: 2 }}>
              Hak Akses Sistem
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: alpha('#4CAF50', 0.1), borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} color="#4CAF50" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon fontSize="small" />
                  Full System Access
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Akses penuh ke semua modul sistem
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, bgcolor: alpha('#2196F3', 0.1), borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} color="#2196F3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon fontSize="small" />
                  System Configuration
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Dapat mengkonfigurasi semua pengaturan sistem
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, bgcolor: alpha('#9C27B0', 0.1), borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} color="#9C27B0" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminIcon fontSize="small" />
                  User Management
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Dapat mengelola semua pengguna dan hak akses
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* System Stats */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Statistik Sistem
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box sx={{ p: 2, bgcolor: alpha('#2196F3', 0.05), borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="#2196F3">
                  {data.stats?.total_users || "0"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Pengguna
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ p: 2, bgcolor: alpha('#4CAF50', 0.05), borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="#4CAF50">
                  {data.stats?.active_companies || "0"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Perusahaan Aktif
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ p: 2, bgcolor: alpha('#FF9800', 0.05), borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="#FF9800">
                  {data.stats?.total_stores || "0"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Toko
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ p: 2, bgcolor: alpha('#9C27B0', 0.05), borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="#9C27B0">
                  {data.stats?.today_transactions || "0"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Transaksi Hari Ini
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}