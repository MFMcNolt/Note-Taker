const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const dbFilePath = path.join(__dirname, 'db', 'db.json');

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = generateUniqueId(); // Generate a unique ID for the new note
  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  saveNotes(updatedNotes);
  res.json({ message: 'Note deleted successfully' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function getNotes() {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading notes:', error);
    return [];
  }
}

function saveNotes(notes) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes), 'utf8');
  } catch (error) {
    console.error('Error saving notes:', error);
  }
}

function generateUniqueId() {
  return uuidv4();
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
