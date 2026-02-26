import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import AuthSideIllustration from "../components/AuthSideIllustration";
import Footer from "../components/Footer";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const passwordsMatch = formData.password !== "" && formData.password === confirmPassword;
  const passwordMismatch = confirmPassword !== "" && formData.password !== confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setSnackbar({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }
    try {
      await API.post("/auth/register", formData);
      setSnackbar({
        open: true,
        message: "Registration successful! Redirecting to login...",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Registration failed. Please try again.",
        severity: "error",
      });
    }
  };

  const greenTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#35b929",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#35b929",
    },
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <Box className="flex flex-1 flex-col justify-center md:flex-row bg-gray-50 bg-gradient-to-br from-[#f0d5c2]/90 via-[#d6e9dd]/90 to-[#96f3d5]/90 md:bg-white">
        <Box className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
          <Box className="w-full max-w-md">
            <Box mt={3} mb={1}>
              <Typography variant="h3" component="h1" fontWeight="800" className="text-green-600 my-4">
                XPNZ.
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="h6" className="text-gray-500 mb-8 font-medium">
                Create an account to start tracking.
              </Typography>
            </Box>
            <Box className="flex gap-6 mt-6 mb-4 border-b border-gray-300">
              <Typography
                className="pb-2 font-medium cursor-pointer text-gray-400 hover:text-gray-600 transition"
                onClick={() => navigate("/")}
              >
                Log In
              </Typography>
              <Typography
                className="pb-2 font-bold cursor-pointer border-b-2 border-green-600 text-green-600"
              >
                Sign Up
              </Typography>
            </Box>

            <form onSubmit={handleRegister}>
              <Box my={1}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  placeholder="johndoe"
                  value={formData.username}
                  sx={greenTextFieldStyle}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box my={1}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  placeholder="example@email.com"
                  value={formData.email}
                  sx={greenTextFieldStyle}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box my={1}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  placeholder="••••••••"
                  value={formData.password}
                  sx={greenTextFieldStyle}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box my={1}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  placeholder="••••••••"
                  value={confirmPassword}
                  error={passwordMismatch}
                  helperText={
                    passwordMismatch
                      ? "Passwords do not match"
                      : passwordsMatch
                        ? "Passwords match"
                        : ""
                  }
                  FormHelperTextProps={{
                    sx: { color: passwordsMatch ? "#35b929 !important" : "" }
                  }}
                  sx={greenTextFieldStyle}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: passwordsMatch && (
                      <InputAdornment position="end">
                        <CheckCircleIcon sx={{ color: "#35b929" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={passwordMismatch}
                sx={{
                  py: 1.5,
                  mt: 2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(53, 185, 41, 0.2)',
                  backgroundColor: '#35b929',
                  '&:hover': { backgroundColor: '#00a63e' },
                  '&:disabled': { backgroundColor: '#ccc' }
                }}
              >
                Sign Up
              </Button>
            </form>
          </Box>
        </Box>

        <AuthSideIllustration
          title="Start Your Journey Today."
          subtitle="Join thousands of users who have mastered their finances with XPNZ."
        />
      </Box>

      {/* Modern Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px", fontWeight: "bold" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}

export default Register;
