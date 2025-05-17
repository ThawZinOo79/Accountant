import * as React from "react";
import AddProductForm from "./AddProductForm";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [stockFilter, setStockFilter] = React.useState("all");

  const [rows, setRows] = React.useState<Data[]>([
  createData("Basic T-Shirt", "T-shirt", 19.99, 50, "in-stock"),
  createData("Slim Fit Jeans", "Pants", 49.99, 0, "out-of-stock"),
  createData("Cotton Hoodie", "Sweater", 39.99, 25, "in-stock"),
  createData("Summer Dress", "Dress", 29.99, 0, "out-of-stock"),
  createData("Sports Shorts", "Shorts", 24.99, 18, "in-stock"),
  createData("Leather Jacket", "Outerwear", 89.99, 7, "in-stock"),
  createData("Linen Shirt", "Shirt", 34.99, 0, "out-of-stock"),
]);

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
  const voucherRef = React.useRef<HTMLDivElement>(null);
  const totalPrice = filteredRows.reduce(
    (sum, row) => sum + row.price * row.quantity,
    0,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="table-container">
      <div
        className="table-controls"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <TextField
            select
            label="Stock Filter"
            variant="outlined"
            size="small"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="in-stock">In Stock</MenuItem>
            <MenuItem value="out-of-stock">Out of Stock</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const code = "VOUCHER-" + Math.floor(1000 + Math.random() * 9000);
              setVoucherCode(code);
              setShowVoucher(true); // <-- This is needed to render the voucherRef element

              setTimeout(async () => {
                if (voucherRef.current) {
                  const canvas = await html2canvas(voucherRef.current);
                  const imgData = canvas.toDataURL("image/png");
                  const pdf = new jsPDF("p", "mm", "a4");

                  const imgWidth = 190;
                  const pageHeight = 297;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;

                  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
                  pdf.save(`${code}.pdf`);

                  setShowVoucher(false);
                } else {
                  console.error("Voucher ref is not available");
                }
              }, 300);
            }}
          >
            Export
          </Button>
        </div>

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
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    ×
                  </span>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <AddProductForm
        onAdd={(newProduct) => {
          const newRow = createData(
            newProduct.name,
            newProduct.category,
            newProduct.price,
            newProduct.quantity,
            newProduct.stock,
          );
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <Paper className="main-table" sx={{ width: "100%", overflow: "visible" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
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
                            {column.id === "stock" ? (
                              <span
                                style={{
                                  color:
                                    row.stock === "in-stock" ? "green" : "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value === "in-stock"
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </span>
                            ) : column.id === "price" &&
                              typeof value === "number" ? (
                              formatCurrency(value)
                            ) : (
                              value
                            )}
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
        <div
          ref={voucherRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: "0",
            width: "600px",
            backgroundColor: "#fff",
            padding: "20px",
          }}
        >
          <h3>Voucher Code: {voucherCode}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                      padding: "6px",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => {
                    const value = row[col.id];
                    return (
                      <td
                        key={col.id}
                        style={{
                          padding: "6px",
                          color:
                            col.id === "stock"
                              ? value === "in-stock"
                                ? "green"
                                : "red"
                              : "inherit",
                          fontWeight: col.id === "stock" ? "bold" : "normal",
                        }}
                      >
                        {col.id === "stock"
                          ? value === "in-stock"
                            ? "In Stock"
                            : "Out of Stock"
                          : col.id === "price" && typeof value === "number"
                            ? formatCurrency(value)
                            : value}
                      </td>
                    );
                  })}
                  <td style={{ padding: "6px" }}>
                    {formatCurrency(row.price * row.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            style={{
              fontWeight: "bold",
              color: "#000",
              fontSize: "18px",
              marginTop: "16px",
            }}
          >
            Total Price:{" "}
            {formatCurrency(
              filteredRows.reduce((sum, r) => sum + r.price * r.quantity, 0),
            )}
          </p>
        </div>
      )}
    </div>
  );
}
