import { useEffect, useState } from "react";
import api from "../../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Business,
  Store,
  People,
  Receipt,
  Refresh,
  CalendarToday,
  AttachMoney,
  ShoppingCart,
  Category,
  Warning,
  Schedule
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Monokrom color palette
const COLORS = {
  primary: '#1A1A1A',
  secondary: '#404040',
  accent: '#666666',
  light: '#8C8C8C',
  lighter: '#BFBFBF',
  lightest: '#F5F5F5',
  background: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

export default function DashboardSuperAdmin() {
  const [stats, setStats] = useState({
    totalPerusahaan: 0,
    totalToko: 0,
    totalUser: 0,
    totalTransaksi: 0,
    pendingPayments: 0,
    activeCompanies: 0,
    expiredCompanies: 0,
    dailyTransactions: 0,
    expiringSoon: 0,
    activeUsers: 0,
    revenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [companyStats, setCompanyStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topPlans, setTopPlans] = useState([]);
  const [filter, setFilter] = useState("mingguan");
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard?type=${filter}`, { withCredentials: true });
      if (res.data.success) {
        setStats(res.data.stats);
        setChartData(res.data.chart);
        setCompanyStats(res.data.companyStats || []);
        setRecentActivities(res.data.recentActivities || []);
        setTopPlans(res.data.topPlans || []);
      }
    } catch (err) {
      console.error("Error fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const StatCard = ({ title, value, icon, trend, subtitle }) => (
    <Card 
      sx={{ 
        borderRadius: 2,
        backgroundColor: COLORS.background,
        border: `1px solid ${COLORS.lighter}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        height: '100%',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderColor: COLORS.light
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="700" color={COLORS.primary} sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color={COLORS.secondary} fontWeight="500" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color={COLORS.light}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: COLORS.lightest,
              borderRadius: '10px',
              p: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 1
            }}
          >
            {icon}
          </Box>
        </Stack>
        {trend && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
            {trend.direction === 'up' ? 
              <TrendingUp sx={{ fontSize: 16, color: COLORS.success }} /> : 
              <TrendingDown sx={{ fontSize: 16, color: COLORS.error }} />
            }
            <Typography 
              variant="caption" 
              fontWeight="600"
              color={trend.direction === 'up' ? COLORS.success : COLORS.error}
            >
              {trend.value}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: COLORS.lightest, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="700"
            color={COLORS.primary}
            sx={{ mb: 1 }}
          >
            Super Admin
          </Typography>
          <Typography variant="body1" color={COLORS.secondary}>
            Overview sistem dan aktivitas terkini
          </Typography>
        </Box>
        
        {/* Hanya tombol refresh yang tersisa di header */}
        <IconButton 
          onClick={fetchDashboardData}
          sx={{
            backgroundColor: COLORS.background,
            border: `1px solid ${COLORS.lighter}`,
            '&:hover': { backgroundColor: COLORS.lightest }
          }}
        >
          <Refresh sx={{ color: COLORS.secondary }} />
        </IconButton>
      </div>

      {loading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress sx={{ backgroundColor: COLORS.lighter, '& .MuiLinearProgress-bar': { backgroundColor: COLORS.primary } }} />
        </Box>
      ) : (
        <>
          {/* Main Statistics */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
              <StatCard
                title="Perusahaan"
                value={stats.totalPerusahaan}
                icon={<Business sx={{ color: COLORS.primary, fontSize: 22 }} />}
              />
            </div>
            
            <div style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
              <StatCard
                title="Total Toko"
                value={stats.totalToko}
                icon={<Store sx={{ color: COLORS.primary, fontSize: 22 }} />}
              />
            </div>
            
            <div style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
              <StatCard
                title="Total User"
                value={stats.totalUser}
                icon={<People sx={{ color: COLORS.primary, fontSize: 22 }} />}
              />
            </div>
            
            <div style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
              <StatCard
                title="Total Pendapatan"
                value={formatCurrency(stats.revenue)}
                icon={<AttachMoney sx={{ color: COLORS.primary, fontSize: 22 }} />}
                subtitle="Terverifikasi"
              />
            </div>
          </div>

          {/* Secondary Statistics */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            <div style={{ flex: '1 1 calc(20% - 16px)', minWidth: '120px' }}>
              <StatCard
                title="Perusahaan Aktif"
                value={stats.activeCompanies}
                icon={<Business sx={{ color: COLORS.success, fontSize: 20 }} />}
              />
            </div>
            
            <div style={{ flex: '1 1 calc(20% - 16px)', minWidth: '120px' }}>
              <StatCard
                title="Expired"
                value={stats.expiredCompanies}
                icon={<Warning sx={{ color: COLORS.error, fontSize: 20 }} />}
              />
            </div>
            
            <div style={{ flex: '1 1 calc(20% - 16px)', minWidth: '120px' }}>
              <StatCard
                title="Kedaluwarsa"
                value={stats.expiringSoon}
                icon={<Schedule sx={{ color: COLORS.warning, fontSize: 20 }} />}
                subtitle="7 hari"
              />
            </div>
            
            <div style={{ flex: '1 1 calc(20% - 16px)', minWidth: '120px' }}>
              <StatCard
                title="Pending"
                value={stats.pendingPayments}
                icon={<Receipt sx={{ color: COLORS.warning, fontSize: 20 }} />}
              />
            </div>
            
            <div style={{ flex: '1 1 calc(20% - 16px)', minWidth: '120px' }}>
              <StatCard
                title="User Aktif"
                value={stats.activeUsers}
                icon={<People sx={{ color: COLORS.primary, fontSize: 20 }} />}
                subtitle="30 hari"
              />
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            marginBottom: '32px' 
          }}>
            {/* Revenue Chart */}
            <div style={{ flex: '1 1 calc(66.666% - 20px)', minWidth: '300px' }}>
              <Card sx={{ 
                borderRadius: 2, 
                p: 2.5, 
                backgroundColor: COLORS.background,
                border: `1px solid ${COLORS.lighter}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                {/* Header dengan judul dan filter periode */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" color={COLORS.primary}>
                    Statistik Pendapatan
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Periode</InputLabel>
                    <Select
                      value={filter}
                      label="Periode"
                      onChange={(e) => setFilter(e.target.value)}
                      sx={{ backgroundColor: COLORS.background }}
                    >
                      <MenuItem value="harian">Harian</MenuItem>
                      <MenuItem value="mingguan">Mingguan</MenuItem>
                      <MenuItem value="bulanan">Bulanan</MenuItem>
                      <MenuItem value="tahunan">Tahunan</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lighter} />
                    <XAxis 
                      dataKey="periode" 
                      tick={{ fill: COLORS.secondary }}
                    />
                    <YAxis 
                      tick={{ fill: COLORS.secondary }}
                      tickFormatter={(value) => formatCurrency(value).replace('Rp', '')}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                      contentStyle={{ 
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.lighter}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="transaksi" 
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      dot={{ fill: COLORS.primary, strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, fill: COLORS.primary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Company Status Chart */}
            <div style={{ flex: '1 1 calc(33.333% - 20px)', minWidth: '250px' }}>
              <Card sx={{ 
                borderRadius: 2, 
                p: 2.5, 
                height: '100%',
                backgroundColor: COLORS.background,
                border: `1px solid ${COLORS.lighter}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <Typography variant="h6" fontWeight="600" color={COLORS.primary} sx={{ mb: 3 }}>
                  Status Perusahaan
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={companyStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, value }) => `${status}: ${value}`}
                      outerRadius={80}
                      fill={COLORS.primary}
                      dataKey="value"
                    >
                      {companyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.light][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px' 
          }}>
            {/* Recent Activities */}
            <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '300px' }}>
              <Card sx={{ 
                borderRadius: 2, 
                p: 2.5,
                backgroundColor: COLORS.background,
                border: `1px solid ${COLORS.lighter}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" color={COLORS.primary}>
                    Aktivitas Terbaru
                  </Typography>
                  <Chip 
                    label="7 hari terakhir" 
                    size="small" 
                    variant="outlined" 
                    sx={{ borderColor: COLORS.light, color: COLORS.secondary }}
                  />
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: '600', color: COLORS.secondary }}>Perusahaan</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: COLORS.secondary }}>Aktivitas</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: COLORS.secondary }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: '600', color: COLORS.secondary }}>Waktu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActivities.slice(0, 6).map((activity, index) => (
                        <TableRow 
                          key={index} 
                          hover
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { backgroundColor: COLORS.lightest }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="500" color={COLORS.primary}>
                              {activity.company}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={COLORS.secondary}>
                              {activity.action}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={activity.status} 
                              size="small"
                              color={getStatusColor(activity.status)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={COLORS.light}>
                              {activity.time}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </div>

            {/* Top Subscription Plans */}
            <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '300px' }}>
              <Card sx={{ 
                borderRadius: 2, 
                p: 2.5,
                backgroundColor: COLORS.background,
                border: `1px solid ${COLORS.lighter}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <Typography variant="h6" fontWeight="600" color={COLORS.primary} sx={{ mb: 3 }}>
                  Plan Subscription Populer
                </Typography>
                <Stack spacing={1.5}>
                  {topPlans.slice(0, 5).map((plan, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        border: `1px solid ${COLORS.lighter}`,
                        borderRadius: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                        backgroundColor: COLORS.background,
                        '&:hover': {
                          borderColor: COLORS.light,
                          backgroundColor: COLORS.lightest
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="600" color={COLORS.primary}>
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color={COLORS.light}>
                          {plan.subscribers} subscriber • {plan.duration_days} hari
                        </Typography>
                      </Box>
                      <Chip 
                        label={formatCurrency(plan.price)} 
                        variant="outlined"
                        sx={{ 
                          borderColor: COLORS.primary, 
                          color: COLORS.primary,
                          fontWeight: '600'
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </Card>
            </div>
          </div>
        </>
      )}
    </Box>
  );
}