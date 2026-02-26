import { Box, Typography } from "@mui/material";
import sideImage from "../assets/sideimage.png";

function AuthSideIllustration({ title = "Take Control of Your Expenses.", subtitle = "Track daily spending, monitor budgets, and gain powerful insights - all in one smart expense management platform." }) {
  return (
    <Box className="hidden md:flex w-2/4 bg-gradient-to-br from-green-500 to-emerald-700 items-center justify-center p-12 relative overflow-hidden">
      {/* Background Glow Shapes */}
      <Box className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -mr-36 -mt-36 opacity-10 blur-2xl" />
      <Box className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full -ml-48 -mb-48 opacity-10 blur-2xl" />

      <Box className="relative z-10 text-center text-white max-w-xl">
        {/* Illustration */}
        <img
          src={sideImage}
          alt="Expense Tracking"
          className="w-full max-w-xl mx-auto mb-10 drop-shadow-2xl transition-transform duration-700 hover:scale-105"
        />

        <Typography variant="h4" fontWeight="800" className="mb-4" fontFamily={"math"}>
          {title}
        </Typography>

        <Typography
          variant="h6"
          className="text-green-100 font-light leading-relaxed"
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default AuthSideIllustration;
