// src/pages/Unauthorized.jsx
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        bgcolor: "#f8f9fa",
        px: 2,
      }}
    >
      <Typography variant="h3" color="error" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" gutterBottom>
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)} // kembali ke halaman sebelumnya
        sx={{ mt: 3 }}
      >
        Kembali
      </Button>
    </Box>
  );
}
