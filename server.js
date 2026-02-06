const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(cors());
// Menerima JSON standar dan JSON FHIR
app.use(bodyParser.json({ type: ['application/json', 'application/fhir+json'] }));

let dataMasuk = [];

// 1. Endpoint Cek Status (Untuk Browser)
app.get('/', (req, res) => {
  res.json({
    status: "ONLINE",
    message: "MOCK SATUSEHAT SERVER READY",
    total_data: dataMasuk.length,
    logs: dataMasuk.slice(-5) // Tampilkan 5 data terakhir
  });
});

// 2. Endpoint Terima Data (Simulasi Kiriman dari Puskesmas)
app.post('/fhir/Bundle', (req, res) => {
  const payload = req.body;
  const waktu = new Date().toLocaleTimeString();

  console.log(`\n[${waktu}] 📨 Ada kiriman data baru!`);

  // Simpan ke memori sementara
  dataMasuk.push({
    waktu: waktu,
    isi: payload
  });

  // Balas seolah-olah sukses (200 OK)
  res.status(200).json({
    resourceType: "Bundle",
    type: "transaction-response",
    entry: [ { response: { status: "201 Created" } } ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Server jalan di port ${PORT}`);
});