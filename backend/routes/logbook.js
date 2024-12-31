const express = require("express");
const db = require("../db");
const router = express.Router();

// Create (Tambah Data Inventori)
router.post("/add", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { kegiatan, tanggal } = req.body;

  if (!kegiatan || !tanggal) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const query = "INSERT INTO logbook (kegiatan, tanggal) VALUES (?, ?)";
    db.query(query, [kegiatan, tanggal], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data logbook berhasil ditambahkan", data: result });
    });
  } catch (error) {
    console.error(error);
  }
});

// Read (Ambil Semua Data Inventori)
router.get("/", (req, res) => {
  const query = `SELECT * FROM logbook`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).json(results);
  });
});

// Endpoint untuk mengedit data inventory
router.put("/edit/:id", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { id } = req.params;
  const { kegiatan, tanggal } = req.body;

  if (!kegiatan || !tanggal || !id) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const query = "UPDATE logbook SET kegiatan = ?, tanggal = ? WHERE id = ?";
    db.query(query, [kegiatan, tanggal, id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data logbook berhasil diedit", data: result });
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Terjadi kesalahan server" }).status(500);
  }
});

// Delete (Hapus Data serah terima)
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  try {
    const query = "DELETE FROM logbook WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.status(200).json({ message: "Data logbook berhasil dihapus", data: result });
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Terjadi kesalahan server" }).status(500);
  }
});

module.exports = router;
