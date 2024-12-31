const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const router = express.Router();

// Create (Tambah Data Inventori)
router.post("/register", async (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query = "INSERT INTO user (username, password) VALUES (?, ?)";
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data user berhasil ditambahkan" });
    });
  } catch (error) {
    console.error(error);
  }
});

// Read (Ambil Semua Data Inventori)
router.post("/login", async (req, res) => {
  console.log("Data diterima:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus diisi." });
  }

  try {
    const sql = "SELECT * FROM user WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if (err) return res.status(500).json({ message: "Terjadi kesalahan." });

      if (results.length === 0) {
        return res.status(400).json({ message: "User tidak ditemukan." });
      }

      const user = results[0];

      // Bandingkan password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password salah." });
      }

      // Login berhasil
      // save session
      req.session.userId = user.id;
      res.status(200).json({ message: "Login berhasil." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan." });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Terjadi kesalahan saat logout." });
    }
    res.status(200).json({ message: "Logout berhasil." });
  });
});

// cek apakah ada 1 user di database
router.get("/user-exist", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data." });
    }
    if (results.length > 0) {
      return res.status(200).json({ data: results });
    }
    return res.status(200).json({ data: [] });
  });
});

module.exports = router;
