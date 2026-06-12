const entryForm = document.getElementById('entryForm');
const cancelButton = document.getElementById('cancelButton');
const entryIdField = document.getElementById('entryId');

function loadEntries() {
  const stored = localStorage.getItem('timeTrackerEntries');
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse saved entries:', error);
    return [];
  }
}

function generateEntryId() {
  return `ENTRY-${Date.now()}`;
}

function setNewEntryId() {
  if (entryIdField) {
    entryIdField.value = generateEntryId();
  }
}

function ensureDashboardArea() {
  let dashboard = document.getElementById(DASHBOARD_ID);
  if (dashboard) {
    return dashboard;
  }

  const mainContent = document.querySelector('.main-content');
  if (!mainContent) {
    return null;
  }

  const section = document.createElement('section');
  section.className = 'dashboard-card';
  section.innerHTML = `
    <h2>Dashboard</h2>
    <div id="${DASHBOARD_ID}" class="dashboard-list"></div>
  `;

  mainContent.appendChild(section);
  return document.getElementById(DASHBOARD_ID);
}

function renderEntries(entries) {
  const dashboard = ensureDashboardArea();
  if (!dashboard) {
    return;
  }

  if (entries.length === 0) {
    dashboard.innerHTML = '<p>No entries saved yet.</p>';
    return;
  }

  const html = entries
    .map(entry => `
      <article class="entry-card">
        <div class="entry-header">
          <strong>${entry.project}</strong>
          <span>${entry.status}</span>
        </div>
        <div class="entry-details">
          <p><strong>Task:</strong> ${entry.task}</p>
          <p><strong>Hours:</strong> ${entry.hours}</p>
          <p><strong>Date:</strong> ${entry.date}</p>
          <p><strong>ID:</strong> ${entry.id}</p>
          ${entry.note ? `<p><strong>Note:</strong> ${entry.note}</p>` : ''}
        </div>
      </article>
    `)
    .join('');

  dashboard.innerHTML = html;
}

function getFormData() {
  const formData = new FormData(entryForm);
  return {
    id: formData.get('entryId') || generateEntryId(),
    project: formData.get('project').trim(),
    task: formData.get('task').trim(),
    hours: parseFloat(formData.get('hours')) || 0,
    date: formData.get('date'),
    status: formData.get('status'),
    note: formData.get('note').trim(),
    createdAt: new Date().toISOString(),
  };
}

function init() {
  if (entryForm) {
    setNewEntryId();

    entryForm.addEventListener('submit', event => {
      event.preventDefault();

      const entry = getFormData();
      const currentEntries = loadEntries();
      currentEntries.push(entry);
      saveEntries(currentEntries);

      entryForm.reset();
      setNewEntryId();
    });

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        entryForm.reset();
        setNewEntryId();
      });
    }

    return;
  }

  const entries = loadEntries();
  ensureDashboardArea();
  renderEntries(entries);
}

document.addEventListener('DOMContentLoaded', init);