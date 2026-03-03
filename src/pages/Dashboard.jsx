import React, { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Tooltip as MuiTooltip,
  Dialog,
  TablePagination,
} from "@mui/material";

import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

dayjs.extend(isLeapYear);
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  LineChart,
  PieChart,
} from "@mui/x-charts";

import * as MuiIcons from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import {
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  Category as CategoryIcon,
  ReceiptLong as ReceiptIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    summary: { total_spent: 0, average: 0, count: 0, max: 0 },
    categories: [],
    trend: []
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [period, setPeriod] = useState("month");
  const [refDate, setRefDate] = useState(dayjs()); // Selected reference date
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const dailyAverage = useMemo(() => {
    const totalSpent = Number(stats.summary.total_spent || 0);
    if (totalSpent === 0) return 0;

    let days = 1;
    if (period === "week") days = 7;
    else if (period === "month") days = refDate.daysInMonth();
    else if (period === "year") days = refDate.isLeapYear() ? 366 : 365;
    else if (period === "day") days = 1;

    return totalSpent / days;
  }, [stats.summary.total_spent, period, refDate]);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isScreen = useMediaQuery(theme.breakpoints.down("xl"));

  // Helper to get date range based on period and refDate
  const getDateRange = (p, date) => {
    let start, end;

    if (p === "day") {
      start = date.startOf("day");
      end = date.endOf("day");
    } else if (p === "week") {
      start = date.startOf("week");
      end = date.endOf("week");
    } else if (p === "month") {
      start = date.startOf("month");
      end = date.endOf("month");
    } else if (p === "year") {
      start = date.startOf("year");
      end = date.endOf("year");
    }

    return {
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
    };
  };

  // Navigation logic
  const handlePrev = () => {
    setRefDate(prev => prev.subtract(1, period));
  };
  const headerCell = {
    fontWeight: 700,
    color: "#64748b",
    bgcolor: "white",
  };

  const bodyCell = {
    color: "#475569",
    fontSize: 14,
  };

  const handleNext = () => {
    setRefDate(prev => prev.add(1, period));
  };

  let trendGrouping = "day";

  if (period === "day") trendGrouping = "day";
  if (period === "week") trendGrouping = "day";
  if (period === "month") trendGrouping = "day";
  if (period === "year") trendGrouping = "month";

  // ---------------- FETCH ----------------
  const fetchDashboardData = async () => {
    try {
      const range = getDateRange(period, refDate);
      const params = { 
        start: range.start, 
        end: range.end,
        limit: rowsPerPage,
        offset: page * rowsPerPage
      };

      const [expRes, summaryRes, catRes, trendRes] = await Promise.all([
        API.get("/process/", { params }), // Filtered transactions
        API.get("/process/stats/summary", { params: { start: range.start, end: range.end } }),
        API.get("/process/stats/by-category", { params: { start: range.start, end: range.end } }),
        API.get("/process/stats/trend", { params: { start: range.start, end: range.end, period: trendGrouping } })
      ]);

      setExpenses(expRes.data.expenses || []);
      setTotalRecords(summaryRes.data.count || 0);

      const formattedStats = {
        summary: summaryRes.data,
        categories: (catRes.data || []).map((c) => ({
          id: c.category,
          value: Number(c.total),
          label: c.category,
          color: c.color_code
        })),
        trend: {
          labels: (trendRes.data || []).map(t => t.date),
          values: (trendRes.data || []).map(t => Number(t.total))
        }
      };

      setStats(formattedStats);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period, refDate, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Period label formatter
  const getPeriodLabel = () => {
    if (period === "day") return refDate.format("MMMM D, YYYY");
    if (period === "week") return `Week of ${refDate.startOf("week").format("MMM D")} - ${refDate.endOf("week").format("MMM D, YYYY")}`;
    if (period === "month") return refDate.format("MMMM YYYY");
    if (period === "year") return refDate.format("YYYY");
    return "";
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ---------------- CRUD ----------------
  const handleCreate = async (formData) => {
    await API.post("/process/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setIsExpenseModalOpen(false);
    fetchDashboardData();
  };

  const handleUpdate = async (formData) => {
    await API.put("/process/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setEditingExpense(null);
    setIsExpenseModalOpen(false);
    fetchDashboardData();
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await API.delete("/process/", { data: { expenseId } });
      fetchDashboardData();
    }
  };

  // ---------------- UI ----------------
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="min-h-screen flex flex-col bg-[#f8fafc]">
        {/* ---------- APP BAR ---------- */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', color: '#1e293b' }}
        >
          <Toolbar className="max-w-7xl mx-auto w-full flex justify-between">
            <Box className="flex items-center gap-2">
              <Avatar sx={{ bgcolor: '#35b929', width: 32, height: 32 }}>
                <WalletIcon fontSize="small" />
              </Avatar>
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{ color: '#35b929', letterSpacing: '-0.5px' }}
              >
                XPNZ.
              </Typography>
            </Box>

            <Box className="flex items-center gap-4">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsExpenseModalOpen(true)}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  backgroundColor: '#35b929',
                  '&:hover': { backgroundColor: '#00a63e' }
                }}
              >
                {isMobile ? "Add" : "New Expense"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  borderColor: '#e2e8f0',
                  '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f1f5f9' }
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ---------- CONTENT ---------- */}
        <Container maxWidth="xl" className="py-8 flex-1">
          {/* ---------- HEADER & PERIOD SELECTOR ---------- */}
          <Box className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <Box>
              <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b' }} className="text-center md:text-left">
                Dashboard
              </Typography>
              <Box className="flex items-center gap-2 mt-1">
                <IconButton size="small" onClick={handlePrev} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                  <PrevIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" fontWeight="700" sx={{ color: '#35b929', minWidth: 200, textAlign: 'center' }}>
                  {getPeriodLabel()}
                </Typography>
                <IconButton size="small" onClick={handleNext} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                  <NextIcon fontSize="small" />
                </IconButton>

                <Box sx={{ width: 40, display: "flex", alignItems: "center" }}>
                  <DatePicker
                    value={refDate}
                    onChange={(val) => setRefDate(val)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          width: 40,
                          "& .MuiInputAdornment-root": {
                            marginLeft: "-14px",
                          },                          
                        },
                      },
                      openPickerButton: {
                        sx: {
                          margin: 0,
                          color: "#35b929"
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box className="bg-white p-1 rounded-2xl border border-gray-200 flex gap-1 shadow-sm">
              {["day", "week", "month", "year"].map((p) => (
                <Chip
                  key={p}
                  label={p.charAt(0).toUpperCase() + p.slice(1)}
                  clickable
                  onClick={() => setPeriod(p)}
                  sx={{
                    backgroundColor: period === p ? "#35b929" : "transparent",
                    color: period === p ? "white" : "#64748b",
                    fontWeight: "600",
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: period === p ? "#35b929" : "#f1f5f9" }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* ---------- SUMMARY CARDS ---------- */}
          <Grid container spacing={3} className="mb-8">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <Box className="h-1 bg-green-500" />
                <CardContent className="p-6">
                  <Box className="flex justify-between items-start mb-2">
                    <Typography className="text-gray-500 font-semibold text-sm uppercase">{period} spent</Typography>
                    <Avatar sx={{ bgcolor: 'rgba(53, 185, 41, 0.1)', color: '#35b929', width: 32, height: 32 }}>
                      <TrendingUpIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b' }}>
                    Rs. {Number(stats.summary.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <Box className="h-1 bg-blue-500" />
                <CardContent className="p-6">
                  <Box className="flex justify-between items-start mb-2">
                    <Typography className="text-gray-500 font-semibold text-sm">TRANSACTIONS</Typography>
                    <Avatar sx={{ bgcolor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', width: 32, height: 32 }}>
                      <ReceiptIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b' }}>
                    {stats.summary.count || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <Box className="h-1 bg-amber-500" />
                <CardContent className="p-6">
                  <Box className="flex justify-between items-start mb-2">
                    <Typography className="text-gray-500 font-semibold text-sm">AVG. PER EXPENSE</Typography>
                    <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 32, height: 32 }}>
                      <CategoryIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b' }}>
                    Rs. {Number(stats.summary.average || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <Box className="h-1 bg-purple-500" />
                <CardContent className="p-6">
                  <Box className="flex justify-between items-start mb-2">
                    <Typography className="text-gray-500 font-semibold text-sm">AVG DAILY EXPENSE</Typography>
                    <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 32, height: 32 }}>
                      <CalendarIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b' }}>
                    Rs. {Number(dailyAverage || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ---------- CHARTS ---------- */}
          <Grid container spacing={3} className="mb-8">
            {/* Trend Chart */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Paper className="p-6 rounded-2xl border-none shadow-sm h-[450px] flex flex-col">
                <Box className="flex justify-between items-center mb-6">
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
                    Spending Trend
                  </Typography>
                  <Typography variant="caption" className="text-gray-400 font-medium uppercase">
                    {period} VIEW
                  </Typography>
                </Box>

                <Box className="flex-1 flex justify-center">
                  {!stats.trend.values || stats.trend.values.length === 0 ? (
                    <Box className="h-full flex items-center justify-center">
                      <Typography className="text-gray-400">No data for this period</Typography>
                    </Box>
                  ) : (
                    <LineChart
                      xAxis={[{
                        data: stats.trend.labels,
                        scaleType: 'point',
                        tickLabelStyle: { fontSize: 11, fill: '#64748b' }
                      }]}
                      series={[{
                        data: stats.trend.values,
                        area: true,
                        color: '#35b929',
                        showMark: true
                      }]}
                      height={350}
                      margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
                      grid={{ horizontal: true }}
                      sx={{
                        ".MuiLineElement-root": { strokeWidth: 3 },
                        ".MuiAreaElement-root": { fill: "url(#swatch-gradient)", opacity: 0.1 }
                      }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Category Chart */}
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Paper className="p-6 rounded-2xl border-none shadow-sm h-[450px] flex flex-col">
                <Typography variant="h6" fontWeight="bold" className="mb-6" sx={{ color: '#1e293b' }}>
                  By Category
                </Typography>
                <Box className="flex-1 flex gap-6 items-center justify-center">

                  {/* Chart */}
                  <Box className="flex items-center justify-center">
                    {stats.categories.length === 0 ? (
                      <Typography className="text-gray-400">
                        No category data
                      </Typography>
                    ) : (
                      <PieChart
                        width={isMobile ? 340 : isScreen ? 350 : 400}
                        height={300}
                        margin={{ left: isMobile ? -120 : isScreen ? -110 : -150, right: 0, top: 0, bottom: 0 }}
                        series={[{
                          data: stats.categories,
                          innerRadius: 65,
                          outerRadius: 95,
                          paddingAngle: 4,
                          cornerRadius: 6,
                          valueFormatter: ({ value }) => {
                            const total = stats.summary.total_spent || 0;
                            const percentage =
                              total > 0
                                ? ((value / total) * 100).toFixed(1)
                                : 0;

                            return `${value.toFixed(2)} (${percentage}%)`;
                          },
                        }]}
                        slotProps={{
                          legend: {
                            direction: isMobile ? "column" : "column",
                            position: {
                              horizontal: isMobile ? "right" : "right",
                            },
                            labelStyle: {
                              fontSize: 12,
                            },
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* ---------- TABLE ---------- */}
          <Grid container spacing={4}>
            {/* Recent Transactions Table */}
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 500,
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "white",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{ color: "#1e293b" }}
                  >
                    Transactions
                  </Typography>

                  <Chip
                    label={`${totalRecords} Total Records`}
                    sx={{
                      bgcolor: "rgba(53,185,41,0.08)",
                      color: "#35b929",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Table */}
                <TableContainer sx={{ flex: 1, minHeight: 400 }}>
                  <Table stickyHeader size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headerCell}>Date</TableCell>
                        <TableCell sx={headerCell}>Category</TableCell>
                        <TableCell sx={headerCell}>Description</TableCell>
                        <TableCell sx={headerCell} align="right">
                          Amount
                        </TableCell>
                        <TableCell sx={headerCell} align="center">
                          Receipt
                        </TableCell>
                        <TableCell sx={headerCell} align="center">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {expenses.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            align="center"
                            sx={{
                              py: 8,
                              color: "#94a3b8",
                            }}
                          >
                            No transactions found for this period.
                          </TableCell>
                        </TableRow>
                      ) : (
                        expenses.map((exp) => (
                          <TableRow
                            key={exp.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "#f8fafc",
                              },
                            }}
                          >
                            {/* Date */}
                            <TableCell sx={bodyCell}>
                              {new Date(exp.expense_date).toLocaleDateString()}
                            </TableCell>

                            {/* Category */}
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {exp.icon_name &&
                                  MuiIcons[exp.icon_name] &&
                                  React.createElement(MuiIcons[exp.icon_name], {
                                    sx: {
                                      color: exp.color_code || "#35b929",
                                      fontSize: 18,
                                    },
                                  })}

                                <Chip
                                  label={exp.category_name || exp.category}
                                  size="small"
                                  sx={{
                                    bgcolor: `${exp.color_code || "#35b929"}20`,
                                    color: exp.color_code || "#35b929",
                                    fontWeight: 600,
                                    fontSize: 12,
                                  }}
                                />
                              </Box>
                            </TableCell>

                            {/* Description */}
                            <TableCell
                              sx={{
                                ...bodyCell,
                                maxWidth: 250,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {exp.description || "-"}
                            </TableCell>

                            {/* Amount */}
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                              }}
                            >
                              Rs. {Number(exp.amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>

                            {/* Receipt */}
                            <TableCell align="center">
                              {exp.ref_image ? (
                                <IconButton
                                  size="small"
                                  onClick={() => setPreviewImage(exp.ref_image)}
                                  sx={{
                                    color: "#64748b",
                                    "&:hover": { bgcolor: "#f1f5f9" },
                                  }}
                                >
                                  <ImageIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <Typography variant="caption" sx={{ color: "#cbd5e1" }}>None</Typography>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell align="center">
                              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingExpense(exp);
                                    setIsExpenseModalOpen(true);
                                  }}
                                  sx={{
                                    color: "#35b929",
                                    "&:hover": { bgcolor: "rgba(53,185,41,0.1)" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(exp.id)}
                                  sx={{
                                    color: "#ef4444",
                                    "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={totalRecords}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: "1px solid #f1f5f9",
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                      color: "#64748b",
                      fontWeight: 600,
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Footer />
      </Box>

      {/* Expense Form Modal */}
      <Dialog
        open={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => {
              setIsExpenseModalOpen(false);
              setEditingExpense(null);
            }}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: (theme) => theme.palette.grey[500],
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ pt: 1 }}>
            {isExpenseModalOpen && (
              <ExpenseForm 
                onSubmit={editingExpense ? handleUpdate : handleCreate} 
                initialData={editingExpense} 
              />
            )}
          </Box>
        </Box>
      </Dialog>

      {/* Receipt Preview Dialog */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8fafc",
          minHeight: 400
        }}>
          {previewImage && (
            <img
              src={previewImage}
              alt="Receipt"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
                display: "block"
              }}
            />
          )}
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
}

export default Dashboard;