// src/pages/StokToko.jsx
import React, { useState, useEffect } from "react";
import api from "../../api";

export default function StokToko() {
  const [stok, setStok] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [form, setForm] = useState({ id_barang: "", jumlah: 0 });

  // ambil stok toko
  useEffect(() => {
    fetchStok();
    fetchBarang();
  }, []);

  const fetchStok = async () => {
    const res = await api.get("/stok-toko");
    setStok(res.data);
  };

  const fetchBarang = async () => {
    const res = await api.get("/barang"); // pastikan endpoint /barang sudah ada
    setBarangList(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/stok-toko", form);
    setForm({ id_barang: "", jumlah: 0 });
    fetchStok();
  };

  return (
    <div>
      <h2>Stok Toko</h2>
      <form onSubmit={handleSubmit}>
        {/* dropdown barang */}
        <select
          value={form.id_barang}
          onChange={(e) => setForm({ ...form, id_barang: e.target.value })}
          required
        >
          <option value="">Pilih Barang</option>
          {barangList.map((b) => (
            <option key={b.id_barang} value={b.id_barang}>
              {b.nama_barang}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Jumlah"
          value={form.jumlah}
          onChange={(e) => setForm({ ...form, jumlah: parseInt(e.target.value) || 0 })}
          required
        />
        <button type="submit">Update Stok</button>
      </form>

      <table border="1" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Stok Toko</th>
          </tr>
        </thead>
        <tbody>
          {stok.map((s, idx) => (
            <tr key={idx}>
              <td>{s.nama_barang}</td>
              <td>{s.jumlah}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
