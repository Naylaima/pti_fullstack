const express = require("express");
const db = require("../db");
const router = express.Router();

// Create (Tambah Data Inventori)
router.post("/add", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { kode_alat, nama_barang, id_lokasi } = req.body;

  if (!kode_alat || !nama_barang || !id_lokasi) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const query = "INSERT INTO list_barang (kode_alat, nama_barang, id_lokasi) VALUES (?, ?, ?)";
    db.query(query, [kode_alat, nama_barang, id_lokasi], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data list barang berhasil ditambahkan", data: result });
    });
  } catch (error) {
    console.error(error);
  }
});

// Read (Ambil Semua Data Inventori)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM list_barang WHERE id_lokasi=${id}`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).json(results);
  });
});

// Endpoint untuk mengedit data inventory
router.put("/edit/:id", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { id } = req.params;
  const { kode_alat, nama_barang } = req.body;

  if (!kode_alat || !nama_barang || !id) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const query = "UPDATE list_barang SET kode_alat = ?, nama_barang = ? WHERE id = ?";
    db.query(query, [kode_alat, nama_barang, id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data list barang berhasil diedit", data: result });
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
    const query = "DELETE FROM list_barang WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.status(200).json({ message: "Data list barang berhasil dihapus", data: result });
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Terjadi kesalahan server" }).status(500);
  }
});

module.exports = router;
