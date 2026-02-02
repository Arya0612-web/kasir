import { Box, Typography, Paper, Button } from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function VerifikasiEmail() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          borderRadius: 3,
        }}
      >
        <Email sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Verifikasi Email Diperlukan
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Kami telah mengirimkan link verifikasi ke email Anda.  
          Silakan cek kotak masuk (atau folder spam).
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
          }}
        >
          Kembali ke Login
        </Button>
      </Paper>
    </Box>
  );
}
