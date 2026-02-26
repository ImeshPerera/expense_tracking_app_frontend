import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Box
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from "@mui/icons-material";
import sideImage from "../assets/sideimage.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    alert("Login functionality is currently under development. Please check back later!");
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
    <Box className="min-h-screen flex flex-col md:flex-row bg-gray-50">

      {/* LEFT SIDE: Form Container */}
      <Box className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <Box className="w-full max-w-md">
          <Box mt={3} mb={1}>
            <Typography variant="h3" component="h1" fontWeight="800" className="text-green-600 my-4">
              XPNZ.
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="h6" className="text-gray-500 mb-8 font-medium">
              Welcome back ! Please enter your details.
            </Typography>
          </Box>
          <Box className="flex gap-6 mt-6 mb-4 border-b border-gray-100">
            <Typography
              className="pb-2 font-bold cursor-pointer border-b-2 border-green-600 text-green-600"
            >
              Log In
            </Typography>
            <Typography
              className="pb-2 font-medium cursor-pointer text-gray-400 hover:text-gray-600 transition"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Typography>
          </Box>

          <form onSubmit={handleLogin} className="space-y-5">
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
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                backgroundColor: '#35b929',
                '&:hover': { backgroundColor: '#00a63e' }
              }}
            >
              Log In
            </Button>
          </form>
        </Box>
      </Box>

      {/* RIGHT SIDE: Decorative Illustration */}
      <Box className="hidden md:flex w-2/4 bg-gradient-to-br from-green-500 to-emerald-700 items-center justify-center p-12 relative overflow-hidden">

        {/* Background Glow Shapes */}
        <Box className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -mr-36 -mt-36 opacity-10 blur-2xl" />
        <Box className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full -ml-48 -mb-48 opacity-10 blur-2xl" />

        <Box className="relative z-10 text-center text-white max-w-xl">

          {/* Illustration */}
          <img
            src={sideImage}
            alt="Expense Tracking"
            className="w-full max-w-xl mx-auto mb-10 drop-shadow-2xl"
          />

          <Typography variant="h4" fontWeight="800" className="mb-4" fontFamily={"math"}>
            Take Control of Your Expenses.
          </Typography>

          <Typography
            variant="h6"
            className="text-green-100 font-light leading-relaxed"
          >
            Track daily spending, monitor budgets, and gain powerful insights -
            all in one smart expense management platform.
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}

export default Login;
