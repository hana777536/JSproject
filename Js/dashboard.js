

const user = JSON.parse(
  localStorage.getItem("currentUser")
);

if (!user) {
  window.location.href = "login.html";
}



document.getElementById("username").textContent =
  user.name;
const table = document.getElementById("recentEntries");
const searchInput = document.querySelector('input[type="text"][placeholder="Search entries..."]');
const totalHoursEl = document.getElementById("totalHours");
const activeProjectsEl = document.getElementById("activeProjects");
const pendingTasksEl = document.getElementById("pendingTasks");

let allEntries = [];

function renderEntries(entries) {
  table.innerHTML = "";

  entries.forEach((entry) => {
    table.innerHTML += `
      <tr>
        <td>${entry.date}</td>
        <td>${entry.project}</td>
        <td>${entry.hours}h</td>
        <td class="actions-cell">
          <a class="btn view-btn" href="viewEntry.html?id=${entry.id}">View</a>
          <a class="btn edit-btn" href="editEntry.html?id=${entry.id}">Edit</a>
          <button class="btn delete-btn" onclick="deleteEntry('${entry.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function updateStats(entries) {
  const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
  const activeProjects = new Set(entries.map((entry) => entry.project)).size;

  totalHoursEl.textContent = totalHours;
  activeProjectsEl.textContent = activeProjects;
  pendingTasksEl.textContent = "0";
}

function filterEntries(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) {
    return allEntries;
  }

  return allEntries.filter((entry) => {
    return (
      String(entry.project).toLowerCase().includes(normalized) ||
      String(entry.date).toLowerCase().includes(normalized) ||
      String(entry.hours).toLowerCase().includes(normalized)
    );
  });
}

async function deleteEntry(id) {
  await fetch(`http://localhost:4002/entries/${id}`, {
    method: "DELETE",
  });

  await loadDashboard();
}

async function loadDashboard() {
  const response = await fetch("http://localhost:3000/entries");
  allEntries = await response.json();

  renderEntries(allEntries);
  updateStats(allEntries);
}

searchInput?.addEventListener("input", (event) => {
  const filtered = filterEntries(event.target.value);
  renderEntries(filtered);
  updateStats(filtered);
});

loadDashboard();
