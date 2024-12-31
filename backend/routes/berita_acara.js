const express = require("express");
const db = require("../db");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Create (Tambah Data Inventori)
router.post("/add", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { nomor, nama, from_unit, to_unit, keterangan } = req.body;
  const { filename } = req.file;

  if (!nomor || !nama || !from_unit || !to_unit || !keterangan || !filename) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const query =
      "INSERT INTO berita_acara (nomor, nama, from_unit, to_unit, keterangan, nama_file) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [nomor, nama, from_unit, to_unit, keterangan, filename], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).json({ message: "Data serah terima berhasil ditambahkan", data: result });
    });
  } catch (error) {
    console.error(error);
  }
});

// Read (Ambil Semua Data Inventori)
router.get("/", (req, res) => {
  const query = "SELECT * FROM berita_acara";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).json(results);
  });
});

// Endpoint untuk mengedit data inventory
router.put("/edit/:id", (req, res) => {
  console.log("Data diterima:", req.body); // Logging untuk debugging
  const { id } = req.params;
  const { nomor, nama, from_unit, to_unit, keterangan } = req.body;
  const file = req.file;
  let query;
  let filename = null;

  if (!nomor || !nama || !from_unit || !to_unit || !keterangan) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  if (file) {
    filename = file.filename;
    // delete file lama
    query = "SELECT nama_file FROM berita_acara WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (result.length !== 0) {
        const oldFileName = result[0].nama_file;
        if (oldFileName) {
          // Hapus file lama
          const pathname = path.join(__dirname, "../uploads", oldFileName);
          if (fs.existsSync(pathname)) fs.unlinkSync(pathname);
        }
      }
    });
  }

  try {
    query = `
            UPDATE berita_acara
            SET nomor = ?, nama = ?, from_unit = ?, to_unit = ?, keterangan = ? ${filename ? ", nama_file = ?" : ""}
            WHERE id = ?
        `;
    const update_data = [nomor, nama, from_unit, to_unit, keterangan];
    db.query(query, filename ? [...update_data, filename, id] : [...update_data, id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({ message: "Data berhasil diperbarui", data: result });
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Terjadi kesalahan server" }).status(500);
  }
});

// Delete (Hapus Data serah terima)
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  let query = "";

  query = "SELECT nama_file FROM berita_acara WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (result.length !== 0) {
      const oldFileName = result[0].nama_file;
      if (oldFileName) {
        // Hapus file lama
        const pathname = path.join(__dirname, "../uploads", oldFileName);
        if (fs.existsSync(pathname)) fs.unlinkSync(pathname);
      }
    }
  });

  try {
    query = "DELETE FROM berita_acara WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.status(200).json({ message: "Data serah terima berhasil dihapus", data: result });
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Terjadi kesalahan server" }).status(500);
  }
});

module.exports = router;
