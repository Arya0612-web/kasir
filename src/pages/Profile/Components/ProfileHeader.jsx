import React from "react";
import { Avatar, Box, Typography, Chip, Stack, alpha } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

const ProfileHeader = ({ user, perusahaan, toko }) => {
  if (!user) return null;

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Aktif" 
            size="small" 
            sx={{ 
              bgcolor: '#4caf50',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        );
      case 'expired':
      case 'suspended':
        return (
          <Chip 
            icon={<WarningIcon />} 
            label={status === 'expired' ? 'Kedaluwarsa' : 'Ditangguhkan'} 
            size="small" 
            sx={{ 
              bgcolor: '#f44336',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        );
      case 'pending':
        return (
          <Chip 
            icon={<WarningIcon />} 
            label="Menunggu Verifikasi" 
            size="small" 
            sx={{ 
              bgcolor: '#ff9800',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        );
      default:
        return (
          <Chip 
            icon={<WarningIcon />} 
            label="Belum Berlangganan" 
            size="small" 
            variant="outlined"
          />
        );
    }
  };

  const renderLevelBadge = () => {
    switch (user.id_level) {
      case 3:
        return <Chip icon={<BusinessIcon />} label="Admin Perusahaan" color="primary" size="small" />;
      case 1:
        return <Chip icon={<StoreIcon />} label="Admin Toko" color="success" size="small" />;
      case 2:
        return <Chip icon={<StoreIcon />} label="Kasir" color="warning" size="small" />;
      case 0:
        return <Chip icon={<PersonIcon />} label="Superadmin" color="error" size="small" />;
      default:
        return <Chip icon={<PersonIcon />} label="User" size="small" />;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        bgcolor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 3,
        border: `1px solid ${alpha('#9588e8', 0.2)}`
      }}
    >
      {/* Avatar */}
      <Avatar 
        sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: "primary.main", 
          fontSize: 32,
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        {user.nama_user?.charAt(0).toUpperCase()}
      </Avatar>

      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "700" }}>
            {user.nama_user}
          </Typography>
          {getStatusChip(user.status_akun)}
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Username:</strong> {user.username} • <strong>Email:</strong> {user.email}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {renderLevelBadge()}

          {/* Perusahaan */}
          {user.id_level === 3 && perusahaan && (
            <Chip 
              label={perusahaan.nama_perusahaan} 
              variant="outlined" 
              icon={<BusinessIcon />}
              size="small"
            />
          )}

          {/* Toko */}
          {(user.id_level === 1 || user.id_level === 2) && toko && (
            <Chip 
              label={toko.nama_toko} 
              variant="outlined" 
              icon={<StoreIcon />}
              size="small"
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ProfileHeader;