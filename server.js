const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Mengizinkan akses dari S3
app.use(express.json());

// Konfigurasi Database dari Environment Variables AWS
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'akademik_db'
});

db.connect(err => {
    if (err) {
        console.error('Koneksi RDS Gagal:', err.message);
    } else {
        console.log('Terhubung ke AWS RDS');
    }
});

// Route Utama (Mencegah Cannot GET /)
app.get('/', (req, res) => {
    res.json({ message: "API Sistem Akademik Online!" });
});

// GET: Ambil Data Mahasiswa
app.get('/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Selalu kirim JSON meskipun kosong []
    });
});

// POST: Tambah Data Mahasiswa
app.post('/mahasiswa', (req, res) => {
    const { nim, nama, jurusan } = req.body;
    const query = 'INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)';
    db.query(query, [nim, nama, jurusan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "success", message: "Data berhasil disimpan" });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
