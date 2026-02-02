import Table from "/src/components/Table";

export default function Supplier() {
  const columns = ["ID", "Nama Supplier", "Alamat", "WhatsApp", "Aksi"];
  const data = [
    ["1", "CV Maju Jaya", "Banjar", "0811111111", "Edit | Hapus"],
    ["2", "PT Sumber Makmur", "Tasikmalaya", "0822222222", "Edit | Hapus"],
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Data Supplier</h1>
      <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        + Tambah Supplier
      </button>
      <Table columns={columns} data={data} />
    </div>
  );
}
