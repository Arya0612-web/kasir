import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel,
  Divider,
  Alert,
  Box,
  Grid,
  alpha
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  DarkMode as DarkModeIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon
} from "@mui/icons-material";
import api from "../../../api";

const PURPLE = "#9588e8";

export default function ProfileSettings({ data }) {
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    two_factor_auth: false,
    language: "id",
    timezone: "Asia/Jakarta",
    dark_mode: false,
    auto_logout: 30,
    currency: "IDR",
    date_format: "DD/MM/YYYY"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleToggle = (key) => (event) => {
    setSettings({ ...settings, [key]: event.target.checked });
  };

  const handleChange = (key) => (event) => {
    setSettings({ ...settings, [key]: event.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await api.post("/profile/settings", settings);
      setSuccess("Pengaturan berhasil disimpan!");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      email_notifications: true,
      sms_notifications: false,
      two_factor_auth: false,
      language: "id",
      timezone: "Asia/Jakarta",
      dark_mode: false,
      auto_logout: 30,
      currency: "IDR",
      date_format: "DD/MM/YYYY"
    });
    setSuccess("");
    setError("");
  };

  const SettingCard = ({ title, icon, children, color = PURPLE }) => (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          {React.cloneElement(icon, { sx: { color } })}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      {/* Status Messages */}
      <Grid item xs={12}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            {success}
          </Alert>
        )}
      </Grid>

      {/* Notification Settings */}
      <Grid item xs={12} md={6}>
        <SettingCard
          title="Notifikasi"
          icon={<NotificationsIcon />}
          color="#2196F3"
        >
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email_notifications}
                  onChange={handleToggle("email_notifications")}
                  color="primary"
                />
              }
              label="Notifikasi Email"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Kirim notifikasi melalui email
            </Typography>
            
            <Divider />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.sms_notifications}
                  onChange={handleToggle("sms_notifications")}
                  color="primary"
                />
              }
              label="Notifikasi SMS"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Kirim notifikasi melalui SMS
            </Typography>
          </Stack>
        </SettingCard>
      </Grid>

      {/* Security Settings */}
      <Grid item xs={12} md={6}>
        <SettingCard
          title="Keamanan"
          icon={<SecurityIcon />}
          color="#F44336"
        >
          <FormControlLabel
            control={
              <Switch
                checked={settings.two_factor_auth}
                onChange={handleToggle("two_factor_auth")}
                color="primary"
              />
            }
            label="Two-Factor Authentication"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
            Tambahkan lapisan keamanan ekstra dengan verifikasi 2 langkah
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Auto Logout (menit)
            </Typography>
            <TextField
              select
              value={settings.auto_logout}
              onChange={handleChange("auto_logout")}
              SelectProps={{
                native: true,
              }}
              size="small"
              fullWidth
            >
              <option value={15}>15 menit</option>
              <option value={30}>30 menit</option>
              <option value={60}>1 jam</option>
              <option value={120}>2 jam</option>
              <option value={0}>Tidak pernah</option>
            </TextField>
          </Box>
        </SettingCard>
      </Grid>

      {/* Display Settings */}
      <Grid item xs={12} md={6}>
        <SettingCard
          title="Tampilan"
          icon={<DarkModeIcon />}
          color="#9C27B0"
        >
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dark_mode}
                  onChange={handleToggle("dark_mode")}
                  color="primary"
                />
              }
              label="Mode Gelap"
            />
            <Typography variant="body2" color="text.secondary">
              Tampilkan antarmuka dalam mode gelap
            </Typography>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Format Tanggal
              </Typography>
              <TextField
                select
                value={settings.date_format}
                onChange={handleChange("date_format")}
                SelectProps={{
                  native: true,
                }}
                size="small"
                fullWidth
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </TextField>
            </Box>
          </Stack>
        </SettingCard>
      </Grid>

      {/* Regional Settings */}
      <Grid item xs={12} md={6}>
        <SettingCard
          title="Regional"
          icon={<LanguageIcon />}
          color="#4CAF50"
        >
          <Stack spacing={2}>
            <TextField
              select
              label="Bahasa"
              value={settings.language}
              onChange={handleChange("language")}
              SelectProps={{
                native: true,
              }}
              fullWidth
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </TextField>
            
            <TextField
              select
              label="Zona Waktu"
              value={settings.timezone}
              onChange={handleChange("timezone")}
              SelectProps={{
                native: true,
              }}
              fullWidth
            >
              <option value="Asia/Jakarta">WIB (Jakarta)</option>
              <option value="Asia/Makassar">WITA (Makassar)</option>
              <option value="Asia/Jayapura">WIT (Jayapura)</option>
            </TextField>
            
            <TextField
              select
              label="Mata Uang"
              value={settings.currency}
              onChange={handleChange("currency")}
              SelectProps={{
                native: true,
              }}
              fullWidth
            >
              <option value="IDR">IDR (Rp)</option>
              <option value="USD">USD ($)</option>
            </TextField>
          </Stack>
        </SettingCard>
      </Grid>

      {/* Action Buttons */}
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: alpha(PURPLE, 0.05) }}>
          <CardContent>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ResetIcon />}
                onClick={handleReset}
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Reset ke Default
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={loading}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  bgcolor: PURPLE,
                  '&:hover': { bgcolor: '#7a6de5' },
                }}
              >
                {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}