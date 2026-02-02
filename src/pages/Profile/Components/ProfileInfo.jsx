import React, { useState } from "react";
import { Card, CardContent, Typography, Stack, Box, Grid, Button, alpha } from "@mui/material";
import { 
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Store as StoreIcon
} from "@mui/icons-material";


const InfoItem = ({ icon, label, value, color = "#9588e8" }) => (
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

export default function ProfileInfo({ data }) {
  const [isEdit, setIsEdit] = useState(false);
  const user = data.user;

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
    <Grid container spacing={3}>
      {/* Left Column - Personal Info */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Informasi Pribadi
              </Typography>
              <Button 
                size="small" 
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? 'Batal' : 'Edit'}
              </Button>
            </Box>
            
            <Stack spacing={2}>
              <InfoItem 
                icon={<BadgeIcon />}
                label="Nama Lengkap"
                value={user.nama_user}
              />
              
              <InfoItem 
                icon={<BadgeIcon />}
                label="Username"
                value={user.username}
              />
              
              <InfoItem 
                icon={<EmailIcon />}
                label="Email"
                value={user.email}
              />
              
              <InfoItem 
                icon={<PhoneIcon />}
                label="Telepon"
                value={user.telepon || "-"}
              />
              
              <InfoItem 
                icon={<CalendarIcon />}
                label="Bergabung Sejak"
                value={formatDate(user.created_at)}
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Column - Role & Status */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon color="primary" />
              Hak Akses & Role
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              mb: 3,
              borderRadius: 2, 
              bgcolor: data.id_level === 3 ? alpha('#2196F3', 0.1) : 
                       data.id_level === 1 ? alpha('#4CAF50', 0.1) : 
                       data.id_level === 2 ? alpha('#FF9800', 0.1) : 
                       alpha('#F44336', 0.1),
              border: `2px solid ${
                data.id_level === 3 ? '#2196F3' : 
                data.id_level === 1 ? '#4CAF50' : 
                data.id_level === 2 ? '#FF9800' : '#F44336'
              }`
            }}>
              <Typography variant="body1" fontWeight={600} color={
                data.id_level === 3 ? '#2196F3' : 
                data.id_level === 1 ? '#4CAF50' : 
                data.id_level === 2 ? '#FF9800' : '#F44336'
              }>
                {data.id_level === 3 ? "Admin Perusahaan" : 
                 data.id_level === 1 ? "Admin Toko" : 
                 data.id_level === 2 ? "Kasir" : "Superadmin"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Level akses sistem yang dimiliki
              </Typography>
            </Box>

            {/* Associated Info */}
            {data.id_level === 3 && data.perusahaan && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BusinessIcon fontSize="small" />
                  Perusahaan Terkait
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: alpha('#2196F3', 0.05) }}>
                  <Typography variant="body1" fontWeight={500}>
                    {data.perusahaan.nama_perusahaan}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.perusahaan.alamat || 'Alamat belum diisi'}
                  </Typography>
                </Card>
              </Box>
            )}
            
            {(data.id_level === 1 || data.id_level === 2) && data.toko && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StoreIcon fontSize="small" />
                  Toko Terkait
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: alpha('#FF9800', 0.05) }}>
                  <Typography variant="body1" fontWeight={500}>
                    {data.toko.nama_toko}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.toko.alamat_toko || 'Alamat belum diisi'}
                  </Typography>
                </Card>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}