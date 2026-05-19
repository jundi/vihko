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

function loadNotes() {
  if (fs.existsSync(notesFile)) {
    const data = fs.readFileSync(notesFile, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

function saveNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

app.get('/api/notes', (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const notes = req.body;
  saveNotes(notes);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Vihko server running on http://localhost:${PORT}`);
});
