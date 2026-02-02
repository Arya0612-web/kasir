import React from "react"; 
import { Card, CardContent, Typography, Stack, Box, Grid, alpha } from "@mui/material";
import {
  Person as PersonIcon,
  Store as StoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";

const PURPLE = "#9588e8";

const InfoItem = ({ icon, label, value, color = PURPLE }) => (
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

export default function ProfileKasir({ data }) {
  const u = data.user;
  const t = data.toko;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'expired': return 'Kedaluwarsa';
      case 'pending': return 'Menunggu Verifikasi';
      case 'inactive': return 'Belum Berlangganan';
      default: return 'Tidak Diketahui';
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <PersonIcon color="primary" />
          Profil Kasir
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: PURPLE, mb: 2 }}>
              Informasi Pribadi
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
              icon={<PhoneIcon />}
              label="Telepon"
              value={u.telepon || "-"}
            />
            
            <InfoItem
              icon={<CalendarIcon />}
              label="Bergabung Sejak"
              value={formatDate(u.created_at)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: "#FF9800", mb: 2 }}>
              Informasi Toko
            </Typography>
            
            <InfoItem
              icon={<StoreIcon />}
              label="Nama Toko"
              value={t?.nama_toko}
              color="#FF9800"
            />
            
            <InfoItem
              icon={<StoreIcon />}
              label="Alamat Toko"
              value={t?.alamat_toko || "Alamat belum diisi"}
              color="#FF9800"
            />
            
            <InfoItem
              icon={<PhoneIcon />}
              label="Telepon Toko"
              value={t?.no_wa_toko || "-"}
              color="#FF9800"
            />
            
            <InfoItem
              icon={<AccessTimeIcon />}
              label="Status Akun"
              value={getStatusText(u.status_akun)}
              color={u.status_akun === 'active' ? '#4CAF50' : u.status_akun === 'expired' ? '#F44336' : '#FF9800'}
            />
          </Grid>
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Informasi Akses
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: alpha(PURPLE, 0.05), borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Level Akses
                </Typography>
                <Typography variant="body1" fontWeight={600} color={PURPLE}>
                  Kasir
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: alpha('#4CAF50', 0.05), borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Status Transaksi
                </Typography>
                <Typography variant="body1" fontWeight={600} color="#4CAF50">
                  Dapat Melakukan
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: alpha('#FF9800', 0.05), borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Akses Laporan
                </Typography>
                <Typography variant="body1" fontWeight={600} color="#FF9800">
                  Terbatas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}