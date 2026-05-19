const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const notesFile = path.join(__dirname, 'notes.json');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

function loadData() {
  if (fs.existsSync(notesFile)) {
    const raw = fs.readFileSync(notesFile, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (Array.isArray(data)) {
      return { diaries: { default: data } };
    }
    if (!data.diaries || typeof data.diaries !== 'object') {
      return { diaries: { default: [] } };
    }
    return data;
  }
  return { diaries: { default: [] } };
}

function saveData(data) {
  fs.writeFileSync(notesFile, JSON.stringify(data, null, 2));
}

app.get('/api/diaries', (req, res) => {
  const data = loadData();
  res.json(Object.keys(data.diaries));
});

app.post('/api/diaries', (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ error: 'Diary name is required' });
  }

  const data = loadData();
  if (!data.diaries[name]) {
    data.diaries[name] = [];
    saveData(data);
  }

  res.json({ success: true, diary: name });
});

app.get('/api/notes', (req, res) => {
  const diary = String(req.query.diary || 'default');
  const data = loadData();
  if (!data.diaries[diary]) {
    data.diaries[diary] = [];
    saveData(data);
  }
  res.json(data.diaries[diary]);
});

app.post('/api/notes', (req, res) => {
  const diary = String(req.query.diary || 'default');
  const notes = req.body;
  const data = loadData();
  if (!data.diaries[diary]) {
    data.diaries[diary] = [];
  }
  data.diaries[diary] = notes;
  saveData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Vihko server running on http://localhost:${PORT}`);
});
