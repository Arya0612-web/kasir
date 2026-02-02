import { useEffect, useState } from "react";
import api from "../../api";
import { Box, Button, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

export default function KetTransaksiPage() {
  const [data, setData] = useState([]);
  const [uraian, setUraian] = useState("");
  const [editId, setEditId] = useState(null);

  const getData = async () => {
    const res = await api.get("/ket-transaksi");
    setData(res.data);
  };

  useEffect(() => { getData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/ket-transaksi/${editId}`, { uraian });
    else await api.post("/ket-transaksi", { uraian });
    setUraian("");
    setEditId(null);
    getData();
  };

  const handleEdit = (id, text) => {
    setUraian(text);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/ket-transaksi/${id}`);
    getData();
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Kelola Keterangan Transaksi</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Uraian"
          value={uraian}
          onChange={(e) => setUraian(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>
          {editId ? "Update" : "Tambah"}
        </Button>
      </form>

      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Uraian</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_ket}>
                <TableCell>{item.id_ket}</TableCell>
                <TableCell>{item.uraian}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(item.id_ket, item.uraian)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(item.id_ket)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
