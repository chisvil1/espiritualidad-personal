const express = require('express');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --- INCONSCIENTE COLECTIVO (Simulación de tiempo real) ---
let globalConstellations = 1240 + Math.floor(Math.random() * 100);
setInterval(() => { globalConstellations += Math.floor(Math.random() * 3); }, 60000);

app.get('/api/collective-soul', (req, res) => {
  res.json({ active_now: Math.floor(Math.random() * 40) + 10, total_healed: globalConstellations });
});

app.get('/ping', (req, res) => {
  res.status(200).send('Corazón latiendo...');
});

// API para el chat con Memoria Sistémica
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, lineage_map } = req.body;
    
    // Inyectamos el mapa de linaje en el contexto del sistema
    const systemMessage = messages[0];
    systemMessage.content += `\nESTRUCTURA FAMILIAR CONOCIDA: ${JSON.stringify(lineage_map || {})}.
    Si el usuario menciona a un nuevo familiar, identifícalo y salúdalo mentalmente. 
    Usa frases sanadoras de Bert Hellinger cuando sea el momento oportuno.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.6,
        max_tokens: 500
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error en el campo morfológico" });
  }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.get('/chat', (req, res) => { res.sendFile(path.join(__dirname, 'chat.html')); });

app.listen(PORT, () => {
  console.log(`Portal Galáctico en puerto ${PORT}`);
});
