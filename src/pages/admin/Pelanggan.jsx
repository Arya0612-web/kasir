import Table from "/src/components/Table";

export default function Pelanggan() {
  const columns = ["ID", "Nama", "Alamat", "WhatsApp", "Aksi"];
  const data = [
    ["1", "Budi", "Banjar", "08123456789", "Edit | Hapus"],
    ["2", "Sari", "Ciamis", "08987654321", "Edit | Hapus"],
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Data Pelanggan</h1>
      <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        + Tambah Pelanggan
      </button>
      <Table columns={columns} data={data} />
    </div>
  );
}
