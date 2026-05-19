const monthLabel = document.getElementById('monthLabel');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const notePanel = document.getElementById('notePanel');
const noteDateLabel = document.getElementById('noteDateLabel');
const noteText = document.getElementById('noteText');
const saveNoteButton = document.getElementById('saveNote');
const closeNoteButton = document.getElementById('closeNote');

let notesByDate = new Map();

let activeDate = null;
let currentMonth = new Date();
currentMonth.setDate(1);
let showingEditor = false;

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getMonthKey(date) {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function ensureNoteForDate(date) {
  const key = formatDate(date);
  if (!notesByDate.has(key)) {
    notesByDate.set(key, '');
    syncStorage();
  }
}

async function syncStorage() {
  const data = Array.from(notesByDate.entries());
  try {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
}

function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  monthLabel.textContent = getMonthKey(currentMonth);
  calendarGrid.innerHTML = '';
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = formatDate(new Date());

  for (let i = 0; i < startDay; i += 1) {
    const placeholder = document.createElement('div');
    placeholder.className = 'day-cell empty';
    calendarGrid.appendChild(placeholder);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayDate = new Date(year, month, day);
    const dateKey = formatDate(dayDate);
    const hasNote = notesByDate.has(dateKey);
    const isSelected = activeDate === dateKey;
    const isToday = dateKey === todayKey;

    const dayCell = document.createElement('button');
    dayCell.type = 'button';
    dayCell.className = 'day-cell';
    if (hasNote) dayCell.classList.add('note');
    if (isToday) dayCell.classList.add('today');
    if (isSelected) dayCell.classList.add('selected');

    dayCell.dataset.date = dateKey;

    const label = document.createElement('span');
    label.className = 'day-label';
    label.textContent = day;

    dayCell.appendChild(label);

    if (hasNote) {
      const indicator = document.createElement('div');
      indicator.className = 'note-indicator';
      dayCell.appendChild(indicator);
    }

    dayCell.addEventListener('click', () => selectDay(dayDate));
    calendarGrid.appendChild(dayCell);
  }
}

function selectDay(date) {
  const dateKey = formatDate(date);

  if (activeDate !== dateKey) {
    activeDate = dateKey;
    ensureNoteForDate(date);
    showingEditor = false;
    renderCalendar();
    hideEditor();
    return;
  }

  if (showingEditor) {
    hideEditor();
  } else {
    const savedNote = notesByDate.get(dateKey) || '';
    noteText.value = savedNote;
    noteDateLabel.textContent = new Date(dateKey).toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    showEditor();
  }
}

function showEditor() {
  notePanel.classList.remove('hidden');
  showingEditor = true;
}

function hideEditor() {
  notePanel.classList.add('hidden');
  showingEditor = false;
}

function saveNote() {
  if (!activeDate) return;
  notesByDate.set(activeDate, noteText.value);
  syncStorage();
  renderCalendar();
  hideEditor();
}

function moveMonth(offset) {
  currentMonth.setMonth(currentMonth.getMonth() + offset);
  activeDate = null;
  showingEditor = false;
  hideEditor();
  renderCalendar();
}

prevMonthButton.addEventListener('click', () => moveMonth(-1));
nextMonthButton.addEventListener('click', () => moveMonth(1));
saveNoteButton.addEventListener('click', saveNote);
closeNoteButton.addEventListener('click', () => hideEditor());

async function initApp() {
  try {
    const response = await fetch('/api/notes');
    const data = await response.json();
    notesByDate = new Map(data);
  } catch (err) {
    console.error('Failed to load notes:', err);
  }
  renderCalendar();
}

initApp();
