import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import API from "../api/axios";

function ExpenseForm({ onSubmit, initialData }) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [refImage, setRefImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/process/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount || "");
      
      // Try to find category ID
      let foundId = initialData.categoryId || initialData.category_id;
      
      // If ID is missing, try matching by name from the loaded categories
      if (!foundId && categories.length > 0) {
        const catName = initialData.category_name || initialData.category;
        if (catName) {
          const matchedCat = categories.find(
            c => c.name.toLowerCase() === catName.toLowerCase()
          );
          if (matchedCat) foundId = matchedCat.id;
        }
      }
      
      setCategoryId(foundId || "");
      
      const rawDate = initialData.expense_date || initialData.date;
      setDate(rawDate ? dayjs(rawDate) : dayjs());
      setDescription(initialData.description || "");
    }
  }, [initialData, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("categoryId", categoryId);
    formData.append("date", date.format("YYYY-MM-DD"));
    formData.append("description", description);
    if (refImage) {
      formData.append("ref_image", refImage);
    }
    if (initialData?.id) {
        formData.append("expenseId", initialData.id);
    }
    onSubmit(formData);
    
    if (!initialData) {
        setAmount("");
        setCategoryId("");
        setDate(dayjs());
        setDescription("");
        setRefImage(null);
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
    <Box 
      component="form" 
      sx={{ mb: 0 }}
      onSubmit={handleSubmit} 
      encType="multipart/form-data"
      className="bg-white p-6 flex flex-col gap-4 mb-0"
    >
      <Typography variant="h6" fontWeight="bold" className="text-gray-800">
        {initialData ? "Update Expense" : "Add New Expense"}
      </Typography>
      
      <TextField
        fullWidth
        label="Amount"
        type="number"
        placeholder="0.00"
        value={amount}
        sx={greenTextFieldStyle}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      
      <FormControl fullWidth sx={greenTextFieldStyle} required>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={categoryId}
          label="Category"
          onChange={(e) => setCategoryId(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Date"
        value={date}
        onChange={(newValue) => setDate(newValue)}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            required: true,
            sx: greenTextFieldStyle,
          },
        }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        placeholder="What was this for?"
        value={description}
        sx={greenTextFieldStyle}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Box className="flex flex-col gap-1">
        <Typography variant="caption" className="text-gray-500 ml-1">Receipt / Image</Typography>
        <input
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
          type="file"
          onChange={(e) => setRefImage(e.target.files[0])}
        />
      </Box>

      <Button 
        fullWidth
        variant="contained"
        type="submit"
        sx={{
          py: 1.5,
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          backgroundColor: '#35b929',
          boxShadow: '0 4px 12px rgba(53, 185, 41, 0.2)',
          '&:hover': { backgroundColor: '#00a63e' }
        }}
      >
        {initialData ? "Update Expense" : "Save Expense"}
      </Button>
    </Box>
  );
}

export default ExpenseForm;
