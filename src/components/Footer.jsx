import { Box, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      className="bg-black text-center text-white mt-auto py-1 w-full"
    >
      <Box className="py-1 text-sm">
        © 2026 Copyright:{" "}
        <a href="https://www.imeshperera.com/expense_management_app/"
          className="text-white hover:text-green-400 transition"
          target="_blank"
          rel="noopener noreferrer" >
          Expense Management System </a>{" "} by{" "}
        <a href="https://www.imeshperera.com"
          className="text-white hover:text-green-400 transition font-semibold"
          target="_blank"
          rel="noopener noreferrer" >
          Imesh Perera
        </a>
      </Box>
    </Box>
  );
}

export default Footer;
