import {
  countAssignments,
  countAssignmentsForProfile,
  createMonthMatrix,
  toDateKey,
} from "./calendarLogic.mjs";

const DEFAULT_PROFILE_COLORS = ["#d06f9a", "#f29db8", "#b971ff", "#7ea7f7", "#64b899", "#f2b66d"];

const monthLabelElement = document.querySelector("#month-label");
const calendarGridElement = document.querySelector("#calendar-grid");
const selectedDateLabelElement = document.querySelector("#selected-date-label");
const assignmentCountElement = document.querySelector("#assignment-count");
const assignmentListElement = document.querySelector("#assignment-list");
const assignmentForm = document.querySelector("#assignment-form");
const titleInput = document.querySelector("#title-input");
const courseInput = document.querySelector("#course-input");
const notesInput = document.querySelector("#notes-input");
const prevMonthButton = document.querySelector("#prev-month");
const nextMonthButton = document.querySelector("#next-month");
const todayButton = document.querySelector("#today-button");
const clearDayButton = document.querySelector("#clear-day-button");
const profileListElement = document.querySelector("#profile-list");
const profileForm = document.querySelector("#profile-form");
const profileNameInput = document.querySelector("#profile-name-input");
const profileColorInput = document.querySelector("#profile-color-input");
const activeProfileLabelElement = document.querySelector("#active-profile-label");

const today = new Date();
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
let profiles = [];
let assignmentsByDate = {};
let activeProfileId = null;

function normalizeAppData(data) {
  return {
    profiles: Array.isArray(data.profiles) ? data.profiles : [],
    activeProfileId: data.activeProfileId ?? null,
    assignmentsByDate: data.assignmentsByDate ?? {},
  };
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Keep the fallback message when the error body is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

async function refreshAppData() {
  const data = normalizeAppData(await request("/api/state"));
  profiles = data.profiles;
  activeProfileId = data.activeProfileId;
  assignmentsByDate = data.assignmentsByDate;
  render();
}

async function persistAndRender(path, options) {
  const data = normalizeAppData(await request(path, options));
  profiles = data.profiles;
  activeProfileId = data.activeProfileId;
  assignmentsByDate = data.assignmentsByDate;
  render();
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatSelectedDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function createAssignmentId() {
  return `assignment-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createProfileId() {
  return `profile-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getActiveProfile() {
  return profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null;
}

function renderProfiles() {
  const items = profiles.map((profile) => {
    const wrapper = document.createElement("div");
    wrapper.className = "profile-card";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-chip";

    if (profile.id === activeProfileId) {
      button.classList.add("active");
    }

    const count = countAssignmentsForProfile(assignmentsByDate, profile.id);
    button.innerHTML = `
      <span class="profile-marker" style="--profile-color: ${profile.color}">${escapeHtml(profile.marker)}</span>
      <span class="profile-text">
        <strong>${escapeHtml(profile.name)}</strong>
        <small>${count} assignment${count === 1 ? "" : "s"}</small>
      </span>
    `;

    button.addEventListener("click", async () => {
      await persistAndRender("/api/profiles/active", {
        method: "POST",
        body: JSON.stringify({ profileId: profile.id }),
      });
    });

    wrapper.append(button);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "profile-remove-button";
    removeButton.textContent = "Remove";
    removeButton.disabled = profiles.length === 1;
    removeButton.addEventListener("click", async () => {
      await persistAndRender(`/api/profiles/${profile.id}`, {
        method: "DELETE",
      });
    });
    wrapper.append(removeButton);

    return wrapper;
  });

  profileListElement.replaceChildren(...items);

  const activeProfile = getActiveProfile();
  if (activeProfile) {
    activeProfileLabelElement.innerHTML = `
      <span class="profile-marker inline-marker" style="--profile-color: ${activeProfile.color}">
        ${escapeHtml(activeProfile.marker)}
      </span>
      Adding as ${escapeHtml(activeProfile.name)}
    `;
  } else {
    activeProfileLabelElement.textContent = "Add a profile to start assigning homework.";
  }
}

function renderCalendar() {
  const selectedKey = toDateKey(selectedDate);
  const todayKey = toDateKey(today);
  const weeks = createMonthMatrix(viewDate, assignmentsByDate);
  const cells = [];

  monthLabelElement.textContent = formatMonthLabel(viewDate);

  for (const week of weeks) {
    for (const day of week) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-cell";
      if (!day.inMonth) {
        button.classList.add("outside");
      }
      if (day.key === selectedKey) {
        button.classList.add("selected");
      }
      if (day.key === todayKey) {
        button.classList.add("today");
      }

      button.innerHTML = `
        <span class="day-number">${day.dayNumber}</span>
        <div class="day-preview">
          ${day.assignments
            .slice(0, 2)
            .map(
              (assignment) => `
                <span class="day-pill">
                  <span class="pill-marker" style="--profile-color: ${assignment.profileColor}"></span>
                  ${escapeHtml(assignment.title)}
                </span>
              `
            )
            .join("")}
          ${
            day.assignments.length > 2
              ? `<span class="more-count">+${day.assignments.length - 2} more</span>`
              : ""
          }
        </div>
      `;

      button.addEventListener("click", () => {
        selectedDate = day.date;
        if (!day.inMonth) {
          viewDate = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
        }
        render();
      });

      cells.push(button);
    }
  }

  calendarGridElement.replaceChildren(...cells);
}

function renderAssignments() {
  const selectedKey = toDateKey(selectedDate);
  const assignments = assignmentsByDate[selectedKey] ?? [];

  selectedDateLabelElement.textContent = formatSelectedDate(selectedDate);
  assignmentCountElement.textContent = String(countAssignments(assignmentsByDate));

  if (assignments.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No homework due on this day yet.";
    assignmentListElement.replaceChildren(emptyState);
    return;
  }

  const items = assignments.map((assignment) => {
    const item = document.createElement("li");
    item.className = "assignment-card";
    item.innerHTML = `
      <div class="assignment-owner">
        <span class="profile-marker inline-marker" style="--profile-color: ${assignment.profileColor}">
          ${escapeHtml(assignment.profileMarker)}
        </span>
        <span>${escapeHtml(assignment.profileName)}</span>
      </div>
      <h4>${escapeHtml(assignment.title)}</h4>
      <p class="assignment-meta">${escapeHtml(assignment.course || "No course")}</p>
      <p>${escapeHtml(assignment.notes || "No notes")}</p>
      <div class="assignment-actions">
        <button class="danger-button" type="button">Remove</button>
      </div>
    `;

    item.querySelector("button").addEventListener("click", async () => {
      await persistAndRender(`/api/assignments/${assignment.id}`, {
        method: "DELETE",
      });
    });

    return item;
  });

  assignmentListElement.replaceChildren(...items);
}

function render() {
  renderProfiles();
  renderCalendar();
  renderAssignments();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

assignmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const course = courseInput.value.trim();
  const notes = notesInput.value.trim();
  const activeProfile = getActiveProfile();

  if (!title) {
    titleInput.focus();
    return;
  }

  if (!activeProfile) {
    profileNameInput.focus();
    return;
  }

  await persistAndRender("/api/assignments", {
    method: "POST",
    body: JSON.stringify({
      id: createAssignmentId(),
      dateKey: toDateKey(selectedDate),
      title,
      course,
      notes,
      profileId: activeProfile.id,
    }),
  });

  assignmentForm.reset();
  titleInput.focus();
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = profileNameInput.value.trim();
  const color = profileColorInput.value || DEFAULT_PROFILE_COLORS[0];

  if (!name) {
    profileNameInput.focus();
    return;
  }

  await persistAndRender("/api/profiles", {
    method: "POST",
    body: JSON.stringify({
      id: createProfileId(),
      name,
      color,
    }),
  });

  profileForm.reset();
  profileColorInput.value = DEFAULT_PROFILE_COLORS[profiles.length % DEFAULT_PROFILE_COLORS.length];
});

prevMonthButton.addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  render();
});

nextMonthButton.addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  render();
});

todayButton.addEventListener("click", () => {
  selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  render();
});

clearDayButton.addEventListener("click", async () => {
  await persistAndRender(`/api/assignments?dateKey=${encodeURIComponent(toDateKey(selectedDate))}`, {
    method: "DELETE",
  });
});

refreshAppData().catch((error) => {
  console.error(error);
  activeProfileLabelElement.textContent = "Could not load data from the server.";
});
