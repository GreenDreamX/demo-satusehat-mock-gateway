const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json({ type: ['application/json', 'application/fhir+json'] }));

let receivedBundles = [];

// Endpoint Terima Data (Simulasi SATUSEHAT)
app.post('/fhir/Bundle', (req, res) => {
  const bundle = req.body;
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(`\n[${timestamp}] 📡 DATA MASUK DARI EDGE SERVER`);
  
  if (bundle.resourceType !== 'Bundle') {
    return res.status(400).json({ error: "Format salah, bukan FHIR Bundle" });
  }

  // Coba ambil nama pasien dari payload
  try {
      const patient = bundle.entry.find(e => e.resource.resourceType === 'Patient');
      const name = patient ? patient.resource.name[0].text : "Tanpa Nama";
      console.log(`✅ Pasien: ${name} | ID: ${bundle.id || 'N/A'}`);
  } catch (e) {
      console.log(`⚠️ Data diterima tapi format entry tidak standar`);
  }

  receivedBundles.push(bundle);

  // Balas 'Sukses' ke Edge
  res.status(200).json({
    resourceType: "Bundle",
    type: "transaction-response",
    entry: [{ response: { status: "201 Created" } }]
  });
});

// Endpoint Cek Status (Buka di Browser)
app.get('/', (req, res) => {
  res.json({
    status: "MOCK SATUSEHAT READY",
    total_data_terima: receivedBundles.length,
    pesan: "Server ini siap menerima sinkronisasi dari Edge"
  });
});

app.listen(PORT, () => console.log(`🚀 Server Mock jalan di port ${PORT}`));