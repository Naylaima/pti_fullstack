const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); // Untuk akses folder front-end
const multer = require("multer");
const mysql = require("mysql2");
const fs = require("fs");
const session = require("express-session");
const app = express();

// routes
const inventoryRoutes = require("./routes/inventory");
const beritaAcaraRoutes = require("./routes/berita_acara");
const serahTerimaRoutes = require("./routes/serah_terima");
const lokasiRoutes = require("./routes/lokasi");
const listBarangRoutes = require("./routes/list_barang");
const logbookRoutes = require("./routes/logbook");
const authRoutes = require("./routes/auth");

const PORT = 5000;

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/inventory", inventoryRoutes); // Middleware untuk menyajikan file statis dari folder "frontend"
app.use("/api/lokasi", lokasiRoutes); // Middleware untuk menyajikan file statis dari folder "frontend"
app.use("/api/berita-acara", upload.single("file"), beritaAcaraRoutes); // Middleware untuk menyajikan file statis dari folder "frontend"
app.use("/api/serah-terima", upload.single("file"), serahTerimaRoutes); // Middleware untuk menyajikan file statis dari folder "frontend"
app.use("/api/list-barang", listBarangRoutes); // Middleware untuk menyajikan file statis dari folder "frontend"
app.use("/api/logbook", logbookRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
