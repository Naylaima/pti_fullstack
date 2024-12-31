const express = require('express');
const db = require('../db');
const router = express.Router();

// Create (Tambah Data Inventori)
router.post('/add', (req, res) => {
    console.log('Data diterima:', req.body); // Logging untuk debugging
    const { id, kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal } = req.body;

    if (!id || !kodeAlat || !namaPeralatan || !unit || !fasilitas || !cabang || !tanggal) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const query = 'INSERT INTO inventories (id, kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [id, kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
        res.status(200).json({ message: 'Data inventori berhasil ditambahkan', data: result });
    });
});


// Read (Ambil Semua Data Inventori)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM inventories';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).json(results);
    });
});

// Update (Edit Data Inventori)
// router.put('/edit/:id', (req, res) => {
//     const { id } = req.params;
//     const { kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal } = req.body;
//     const query = 'UPDATE inventories SET kodeAlat = ?, namaPeralatan = ?, unit = ?, fasilitas = ?, cabang = ?, tanggal = ? WHERE id = ?';
//     db.query(query, [kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal, id], (err, result) => {
//         if (err) return res.status(500).send(err.message);
//         res.status(200).json({ message: 'Data inventori berhasil diperbarui', data: result });
//     });
// });


// // API: Get Single Inventory Data for Editing
// router.get('/api/inventory/:id', (req, res) => {
//     const { id } = req.params;
//     const query = 'SELECT * FROM inventories WHERE id = ?';
//     db.query(query, [id], (err, result) => {
//         if (err) return res.status(500).send(err);
//         if (result.length === 0) {
//             return res.status(404).json({ message: 'Data tidak ditemukan' });
//         }
//         res.json(result[0]); // Mengembalikan data yang ditemukan
//     });
// });

// edit 2 des
// Endpoint untuk mendapatkan data inventory berdasarkan ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM inventories WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.json(results[0]); // Mengembalikan data yang ditemukan
    });
});

// Endpoint untuk mengedit data inventory
router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal } = req.body;

    if (!kodeAlat || !namaPeralatan || !unit || !fasilitas || !cabang || !tanggal) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const query = `
        UPDATE inventories 
        SET kodeAlat = ?, namaPeralatan = ?, unit = ?, fasilitas = ?, cabang = ?, tanggal = ? 
        WHERE id = ?
    `;
    db.query(query, [kodeAlat, namaPeralatan, unit, fasilitas, cabang, tanggal, id], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.json({ message: 'Data berhasil diperbarui', data: result });
    });
});



// Delete (Hapus Data Inventori)
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventories WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).json({ message: 'Data inventori berhasil dihapus', data: result });
    });
});

module.exports = router;
