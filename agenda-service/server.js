const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const AGENDA_URL = 'http://www.raydelto.org/agenda.php';

// Algunos servidores rechazan peticiones sin User-Agent (error 403 Forbidden)
const ENCABEZADOS = {
  'User-Agent': 'Mozilla/5.0 (compatible; AgendaService/1.0)',
  'Accept': 'application/json, text/plain, */*'
};

// Permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Sirve el index.html de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// GET /contactos -> lista los contactos almacenados en el servicio remoto
app.get('/contactos', async (req, res) => {
  try {
    const respuesta = await fetch(AGENDA_URL, { headers: ENCABEZADOS });
    if (!respuesta.ok) {
      return res
        .status(502)
        .json({ error: `El servicio remoto respondió con estado ${respuesta.status}` });
    }
    const contactos = await respuesta.json();
    res.json(contactos);
  } catch (error) {
    console.error('Error al listar contactos:', error.message);
    res.status(500).json({ error: 'No se pudo obtener la lista de contactos' });
  }
});

// POST /contactos -> almacena un nuevo contacto en el servicio remoto
app.post('/contactos', async (req, res) => {
  const { nombre, apellido, telefono } = req.body || {};

  if (!nombre || !apellido || !telefono) {
    return res
      .status(400)
      .json({ error: 'Los campos nombre, apellido y telefono son obligatorios' });
  }

  try {
    const respuesta = await fetch(AGENDA_URL, {
      method: 'POST',
      headers: { ...ENCABEZADOS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, telefono })
    });

    // El servicio remoto puede devolver JSON o texto plano
    const texto = await respuesta.text();

    if (!respuesta.ok) {
      return res.status(502).json({
        error: `El servicio remoto respondió con estado ${respuesta.status}: ${texto}`
      });
    }

    let resultado;
    try {
      resultado = JSON.parse(texto);
    } catch {
      resultado = texto;
    }

    res.status(201).json({
      mensaje: 'Contacto almacenado correctamente',
      contacto: { nombre, apellido, telefono },
      respuestaServicio: resultado
    });
  } catch (error) {
    console.error('Error al almacenar contacto:', error.message);
    res.status(500).json({ error: 'No se pudo almacenar el contacto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servicio de agenda escuchando en http://localhost:${PORT}`);
});
