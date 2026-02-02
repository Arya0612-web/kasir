import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  Tooltip as MuiTooltip,
} from "@mui/material";
import {
  Store,
  People,
  Assessment,
  DragIndicator,
  MoreVert,
  Add,
  ViewColumn,
} from "@mui/icons-material";
import { 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight, } from "lucide-react";
import { alpha } from "@mui/material/styles";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from "../../api";

// Komponen SortableRow untuk drag & drop
const SortableRow = ({ row, isSelected, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id_penjualan || row.id_beli,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      sx={{
        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 
                      (row.index % 2 === 0 ? 'transparent' : 'rgba(44, 44, 44, 0.01)'),
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(97, 97, 97, 0.03)',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        },
        '&:last-child td': {
          borderBottom: 'none'
        },
        position: 'relative',
      }}
    >
      <TableCell sx={{ py: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.03)", width: 60 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <Checkbox
            checked={isSelected}
            onChange={onSelect}
            size="small"
          /> */}
          <MuiTooltip title="Drag untuk mengurutkan">
            <IconButton
              size="small"
              {...attributes}
              {...listeners}
              sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <DragIndicator fontSize="small" />
            </IconButton>
          </MuiTooltip>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.03)" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          
          <Typography variant="body2" fontWeight="500" color="#2c2c2c">
            {row.nama_toko || "-"}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.03)" }}>
        <Box>
          <Typography variant="body2" fontWeight="500" color="#2c2c2c">
            {dayjs(row.tgl_jual || row.tgl_beli).format("DD MMM YYYY")}
          </Typography>
          <Typography variant="caption" color="#8d8d8d" sx={{ display: 'block', mt: 0.5 }}>
            {dayjs(row.created_at).format("HH:mm")} • Dicatat
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.03)" }}>
        {row.nama_pelanggan || row.nama_supplier ? (
          <Chip
            label={row.nama_pelanggan || row.nama_supplier}
            size="small"
            variant="filled"
            sx={{
              backgroundColor: 'rgba(97, 97, 97, 0.08)',
              color: '#5a5a5a',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        ) : (
          <Typography variant="body2" color="#8d8d8d" fontStyle="italic">
            {row.nama_pelanggan ? 'Walk-in customer' : '-'}
          </Typography>
        )}
      </TableCell>
      <TableCell align="right" sx={{ py: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.03)" }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="600" color="#2c2c2c">
            Rp {parseFloat(row.total).toLocaleString('id-ID')}
          </Typography>
          <Typography variant="caption" color="#8d8d8d" sx={{ display: 'block', mt: 0.5 }}>
            {row.tgl_jual ? 'Penjualan' : 'Pembelian'}
          </Typography>
        </Box>
      </TableCell>
      {/* <TableCell sx={{ py: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.03)", width: 60 }}>
        <MuiTooltip title="Actions">
          <IconButton size="small">
            <MoreVert fontSize="small" />
          </IconButton>
        </MuiTooltip>
      </TableCell> */}
    </TableRow>
  );
};

// Komponen Tabel dengan Drag & Drop
const DraggableTable = ({ data, title, type }) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // Tambahkan index untuk setiap item
    const itemsWithIndex = data.slice(0, 5).map((item, index) => ({
      ...item,
      index,
    }));
    setItems(itemsWithIndex);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => 
          item.id_penjualan === active.id || item.id_beli === active.id
        );
        const newIndex = items.findIndex((item) => 
          item.id_penjualan === over.id || item.id_beli === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = items.map((item) => item.id_penjualan || item.id_beli);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 0,
        borderRadius: 3,
        background: `linear-gradient(145deg, #ffffff, #f8f9fa)`,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          pb: 2,
          background: `linear-gradient(135deg, rgba(44, 44, 44, 0.02) 0%, rgba(97, 97, 97, 0.01) 100%)`,
          borderBottom: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.04)"
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="600" color="#2c2c2c">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${data.length} transaksi`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(97, 97, 97, 0.3)',
                color: '#5a5a5a',
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
            <MuiTooltip title="Tambah data">
              <IconButton size="small">
                <Add fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>
      </Box>
      
      <TableContainer>
        <Table size="medium" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(44, 44, 44, 0.02)' }}>
              <TableCell sx={{ width: 60, py: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.04)" }}>
                {/* <Checkbox
                  indeterminate={selected.length > 0 && selected.length < items.length}
                  checked={items.length > 0 && selected.length === items.length}
                  onChange={handleSelectAll}
                  size="small"
                /> */}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: '600', 
                  color: '#2c2c2c',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)"
                }}
              >
                Toko
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: '600', 
                  color: '#2c2c2c',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)"
                }}
              >
                Tanggal
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: '600', 
                  color: '#2c2c2c',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)"
                }}
              >
                {type === 'penjualan' ? 'Pelanggan' : 'Supplier'}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  fontWeight: '600', 
                  color: '#2c2c2c',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)"
                }}
              >
                Total
              </TableCell>
              {/* <TableCell 
                sx={{ 
                  width: 60,
                  fontWeight: '600', 
                  color: '#2c2c2c',
                  fontSize: '0.875rem',
                  py: 2,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)"
                }}
              >
                Aksi
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map(item => item.id_penjualan || item.id_beli)} strategy={verticalListSortingStrategy}>
                {items.map((item, index) => {
                  const itemId = item.id_penjualan || item.id_beli;
                  const isItemSelected = isSelected(itemId);
                  
                  return (
                    <SortableRow
                      key={itemId}
                      row={item}
                      isSelected={isItemSelected}
                      onSelect={() => handleSelect(itemId)}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </TableBody>
        </Table>
      </TableContainer>
      
      {items.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="#8d8d8d">
            Belum ada data {type === 'penjualan' ? 'penjualan' : 'pembelian'}
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {items.length > 0 && (
        <Box sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.04)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="#8d8d8d">
            {selected.length} dari {items.length} baris dipilih
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MuiTooltip title="Halaman pertama">
              <IconButton size="small">
                <ChevronsLeft fontSize="small" />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title="Halaman sebelumnya">
              <IconButton size="small">
                <ChevronLeft fontSize="small" />
              </IconButton>
            </MuiTooltip>
            <Typography variant="body2" sx={{ mx: 2 }}>
              Halaman 1 dari 1
            </Typography>
            <MuiTooltip title="Halaman berikutnya">
              <IconButton size="small">
                <ChevronRight fontSize="small" />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title="Halaman terakhir">
              <IconButton size="small">
                <ChevronsRight fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default function DashboardSuperAdmin() {
  const [stats, setStats] = useState({ toko: 0, users: 0, barang: 0 });
  const [pembelian, setPembelian] = useState([]);
  const [penjualan, setPenjualan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resPembelian, resPenjualan] = await Promise.all([
          api.get("/adminperusahaan/stats"),
          api.get("/pembelian"),
          api.get("/penjualan/riwayat"),
        ]);

        setStats(resStats.data);
        setPembelian(
          Array.isArray(resPembelian.data)
            ? resPembelian.data
            : Array.isArray(resPembelian.data?.data)
            ? resPembelian.data.data
            : []
        );
        setPenjualan(
          Array.isArray(resPenjualan.data)
            ? resPenjualan.data
            : resPenjualan.data.data || []
        );
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Toko", value: stats.toko, icon: <Store />, color: "#424242" },
    { label: "Barang", value: stats.barang, icon: <Assessment />, color: "#757575" },
  ];

  // ... (fungsi getFilteredData dan komponen ChartAreaInteractive tetap sama)
  const getFilteredData = () => {
    const now = dayjs();
    let daysToSubtract = 90;
    
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = now.subtract(daysToSubtract, 'day');
    
    const allData = [];
    
    pembelian.forEach(beli => {
      const date = dayjs(beli.tgl_beli);
      if (date.isAfter(startDate)) {
        allData.push({
          date: beli.tgl_beli,
          pembelian: parseFloat(beli.total) || 0,
          penjualan: 0,
          type: 'pembelian'
        });
      }
    });
    
    penjualan.forEach(jual => {
      const date = dayjs(jual.tgl_jual);
      if (date.isAfter(startDate)) {
        allData.push({
          date: jual.tgl_jual,
          pembelian: 0,
          penjualan: parseFloat(jual.total) || 0,
          type: 'penjualan'
        });
      }
    });
    
    const groupedData = {};
    allData.forEach(item => {
      const dateKey = dayjs(item.date).format('YYYY-MM-DD');
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: dateKey,
          pembelian: 0,
          penjualan: 0
        };
      }
      groupedData[dateKey].pembelian += item.pembelian;
      groupedData[dateKey].penjualan += item.penjualan;
    });
    
    return Object.values(groupedData)
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
      .map(item => ({
        ...item,
        name: dayjs(item.date).format("DD/MM")
      }));
  };

  const filteredChartData = getFilteredData();

  const ChartAreaInteractive = () => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
        boxShadow: "15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="600">
              Grafik Transaksi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Menampilkan total pembelian dan penjualan
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Rentang Waktu</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Rentang Waktu"
            >
              <MenuItem value="90d">3 Bulan Terakhir</MenuItem>
              <MenuItem value="30d">30 Hari Terakhir</MenuItem>
              <MenuItem value="7d">7 Hari Terakhir</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ p: 3, pt: 2 }}>
          {filteredChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredChartData}>
                <defs>
                  <linearGradient id="colorPembelian" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <RechartTooltip 
                  formatter={(value) => [`Rp ${Number(value).toLocaleString()}`, '']}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="pembelian" 
                  stroke="#8884d8"
                  fill="url(#colorPembelian)"
                  name="Pembelian"
                  stackId="1"
                />
                <Area 
                  type="monotone" 
                  dataKey="penjualan" 
                  stroke="#82ca9d"
                  fill="url(#colorPenjualan)"
                  name="Penjualan"
                  stackId="1"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Belum ada data transaksi dalam rentang waktu ini
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha("#f5f5f7", 0.9)} 0%, ${alpha("#e0e0e0", 0.9)} 100%)`,
      }}
    >
      <Box maxWidth="1300px" mx="auto">
        {/* Statistik Card */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {statCards.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(145deg, #ffffff, #f5f5f5)`,
                  boxShadow: "15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      backgroundColor: alpha(stat.color, 0.1),
                      borderRadius: "50%",
                      p: 2,
                      mr: 2,
                    }}
                  >
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Grafik Interaktif */}
        <Box sx={{ mb: 4 }}>
          <ChartAreaInteractive />
        </Box>

        {/* Tabel dengan Drag & Drop */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DraggableTable 
            data={pembelian} 
            title="Data Pembelian Terbaru" 
            type="pembelian" 
          />
          <DraggableTable 
            data={penjualan} 
            title="Data Penjualan Terbaru" 
            type="penjualan" 
          />
        </Box>
      </Box>
    </Box>
  );
}