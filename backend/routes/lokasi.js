const express = require("express");
const db = require("../db");
const router = express.Router();

// Create (Tambah Data Inventori)
router.post("/add", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { nama_lokasi } = req.body;
  if (!nama_lokasi) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const query = "INSERT INTO lokasi (nama_lokasi) VALUES (?)";
    db.query(query, [nama_lokasi], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data lokasi berhasil ditambahkan", data: result });
    });
  } catch (error) {
    console.error(error);
  }
});

// Read (Ambil Semua Data Inventori)
router.get("/", (req, res) => {
  const query = "SELECT * FROM lokasi";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).json(results);
  });
});

module.exports = router;
