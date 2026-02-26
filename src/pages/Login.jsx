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
  Lock as LockIcon
} from "@mui/icons-material";
import AuthSideIllustration from "../components/AuthSideIllustration";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      setSnackbar({
        open: true,
        message: "Login Successful! Redirecting...",
        severity: "success",
      });

      // Redirect after a short delay to let the user see the success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Login failed. Please check your credentials.",
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
              <Typography variant="h3" component="h1" fontWeight="800" className="text-green-600 my-4 text-center md:text-left">
                XPNZ.
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="h6" className="text-gray-500 mb-8 font-medium">
                Welcome back! Please enter your details.
              </Typography>
            </Box>
            <Box className="flex gap-6 mt-6 mb-4 border-b border-gray-300">
              <Typography className="pb-2 font-bold cursor-pointer border-b-2 border-green-600 text-green-600">
                Log In
              </Typography>
              <Typography
                className="pb-2 font-medium cursor-pointer text-gray-400 hover:text-gray-600 transition"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Box my={1}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  placeholder="example@email.com"
                  value={email}
                  sx={greenTextFieldStyle}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  sx={greenTextFieldStyle}
                  onChange={(e) => setPassword(e.target.value)}
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
              <Box className="flex justify-end">
                <Typography variant="body2" className="text-green-600 font-semibold cursor-pointer hover:underline">
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(53, 185, 41, 0.2)',
                  backgroundColor: '#35b929',
                  '&:hover': { backgroundColor: '#00a63e' }
                }}
              >
                Log In
              </Button>
            </form>
          </Box>
        </Box>

        <AuthSideIllustration />
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

export default Login;
