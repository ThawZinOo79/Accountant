import React from "react";
import { TextField, Button, MenuItem } from "@mui/material";

interface AddProductFormProps {
  onAdd: (data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    stock: "in-stock" | "out-of-stock";
  }) => void;
}

export default function AddProductForm({ onAdd }: AddProductFormProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    stock: "in-stock",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      stock: formData.stock as "in-stock" | "out-of-stock",
    });

    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      stock: "in-stock",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        size="small"
        required
      />
      <TextField
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        size="small"
        required
      />
      <TextField
        label="Price"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        size="small"
        required
      />
      <TextField
        label="Quantity"
        type="number"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        size="small"
        required
      />
      <TextField
        select
        label="Stock"
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        size="small"
      >
        <MenuItem value="in-stock">In Stock</MenuItem>
        <MenuItem value="out-of-stock">Out of Stock</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" size="medium">
        Add Product
      </Button>
    </form>
  );
}
