import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

interface Column {
  id: "name" | "category" | "price" | "quantity" | "stock";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Product", minWidth: 150 },
  { id: "category", label: "Category", minWidth: 120 },
  {
    id: "price",
    label: "Price ($)",
    minWidth: 100,
    align: "right",
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 100,
    align: "right",
  },
  {
    id: "stock",
    label: "Stock Status",
    minWidth: 130,
  },
];

interface Data {
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: "in-stock" | "out-of-stock";
}

function createData(
  name: string,
  category: string,
  price: number,
  quantity: number,
  stock: "in-stock" | "out-of-stock",
): Data {
  return { name, category, price, quantity, stock };
}

const rows: Data[] = [
  createData("Basic T-Shirt", "T-shirt", 19.99, 50, "in-stock"),
  createData("Slim Fit Jeans", "Pants", 49.99, 0, "out-of-stock"),
  createData("Cotton Hoodie", "Sweater", 39.99, 25, "in-stock"),
  createData("Summer Dress", "Dress", 29.99, 0, "out-of-stock"),
  createData("Sports Shorts", "Shorts", 24.99, 18, "in-stock"),
  createData("Leather Jacket", "Outerwear", 89.99, 7, "in-stock"),
  createData("Linen Shirt", "Shirt", 34.99, 0, "out-of-stock"),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [stockFilter, setStockFilter] = React.useState("all");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch = row.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "all" ? true : row.stock === stockFilter;
    return matchesSearch && matchesStock;
  });

  const [voucherCode, setVoucherCode] = React.useState("");
  const [showVoucher, setShowVoucher] = React.useState(false);
  const totalPrice = filteredRows.reduce(
    (sum, row) => sum + row.price * row.quantity,
    0,
  );
  return (
    <div className="table-container">
      <div className="table-controls">
        
        <TextField
          select
          label="Stock Filter"
          variant="outlined"
          size="small"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="stock-filter"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="in-stock">In Stock</MenuItem>
          <MenuItem value="out-of-stock">Out of Stock</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          className="report-button"
          onClick={() => {
            const code = "VOUCHER-" + Math.floor(1000 + Math.random() * 9000);
            setVoucherCode(code);
            setShowVoucher(true);
          }}
        >
          Export
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm("")}
                ></IconButton>
              </InputAdornment>
            ),
          }}
        />
        
      </div>

      <Paper className="main-table" sx={{ width: "100%", overflow: "visible" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                      className={
                        row.stock === "out-of-stock" ? "out-of-stock-row" : ""
                      }
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {showVoucher && (
        <div className="voucher-box">
          <h3>
            Voucher Code: <span>{voucherCode}</span>
          </h3>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.id}>{col.label}</th>
                ))}
                <th>Subtotal</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => {
                    const value = row[col.id];
                    return (
                      <td key={col.id}>
                        {col.format && typeof value === "number"
                          ? col.format(value)
                          : value}
                      </td>
                    );
                  })}
                  <td>${(row.price * row.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total-price">
            Total Price: <strong>${totalPrice.toFixed(2)}</strong>
          </p>
          <Button size="small" onClick={() => setShowVoucher(false)}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

