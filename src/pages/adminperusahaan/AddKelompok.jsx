import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const AddKelompok = () => {
  const [kelompok, setKelompok] = useState([]);
  const [namaKelompok, setNamaKelompok] = useState("");
  const [editId, setEditId] = useState(null);

  axios.defaults.withCredentials = true;

  // 🔹 Ambil data kelompok (id_perusahaan dari token otomatis)
  const fetchKelompok = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kelompok", {
        withCredentials: true,
      });
      setKelompok(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil kelompok:", err);
      if (err.response?.status === 401) {
        alert("Sesi login berakhir, silakan login ulang!");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchKelompok();
  }, []);

  // 🔹 Tambah / update kelompok
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaKelompok.trim()) return alert("Nama kelompok wajib diisi!");

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/kelompok/${editId}`,
          { nama_kelompok: namaKelompok },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/kelompok",
          { nama_kelompok: namaKelompok },
          { withCredentials: true }
        );
      }

      setNamaKelompok("");
      setEditId(null);
      fetchKelompok();
    } catch (err) {
      console.error("❌ Gagal simpan:", err);
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan!");
    }
  };

  // 🔹 Edit kelompok
  const handleEdit = (item) => {
    setEditId(item.id_kelompok);
    setNamaKelompok(item.nama_kelompok);
  };

  // 🔹 Soft delete kelompok
  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus kelompok ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/kelompok/${id}`, {
          withCredentials: true,
        });
        fetchKelompok();
      } catch (err) {
        console.error("❌ Gagal hapus:", err);
        alert("Gagal menghapus kelompok!");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Kelompok" : "Tambah Kelompok"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nama Kelompok"
              value={namaKelompok}
              onChange={(e) => setNamaKelompok(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {editId ? "Update" : "Tambah"}
            </Button>
          </form>

          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Daftar Kelompok
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {kelompok.map((item) => (
              <ListItem
                key={item.id_kelompok}
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleEdit(item)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id_kelompok)}>
                      <Delete color="error" />
                    </IconButton>
                  </>
                }
              >
                {item.nama_kelompok}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddKelompok;
