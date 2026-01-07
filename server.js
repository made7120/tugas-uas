const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'akademik_db'
});

// Jalankan Query untuk membuat tabel otomatis
db.query(`CREATE TABLE IF NOT EXISTS mahasiswa (
    nim VARCHAR(15) PRIMARY KEY,
    nama VARCHAR(100),
    jurusan VARCHAR(50)
)`, (err) => { if (err) console.log("Tabel sudah ada / error"); });

app.get('/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        res.json(results);
    });
});

app.post('/mahasiswa', (req, res) => {
    const { nim, nama, jurusan } = req.body;
    db.query('INSERT INTO mahasiswa VALUES (?, ?, ?)', [nim, nama, jurusan], (err) => {
        res.json({ message: 'Berhasil!' });
    });
});

app.listen(8080, () => console.log('Server running on port 8080'));
