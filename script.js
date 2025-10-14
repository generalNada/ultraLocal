// DOM Elements
const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteList = document.getElementById("noteList");
const searchInput = document.getElementById("searchInput");
const dateInput = document.getElementById("dateInput");
const viewAllBtn = document.getElementById("viewAllBtn");

// Load notes when the page loads
document.addEventListener("DOMContentLoaded", loadNotes);

// Helper function to check if a string is a URL
function isURL(str) {
  const urlPattern =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  return urlPattern.test(str);
}

function loadNotes() {
  const notes = getNotesFromStorage();
  renderNotes(notes);
}

function getNotesFromStorage() {
  const notes = localStorage.getItem("notes");
  return notes ? JSON.parse(notes) : []; // Parse stored notes or return an empty array
}

function saveNotesToStorage(notes) {
  localStorage.setItem("notes", JSON.stringify(notes)); // Save notes array as a JSON string
}

// Add a note
addNoteBtn.addEventListener("click", () => {
  const content = noteInput.value.trim();
  if (!content) return alert("Note content cannot be empty.");

  const notes = getNotesFromStorage();
  const newNote = {
    id: Date.now(), // Unique ID based on timestamp
    content,
    created_at: new Date().toISOString().split("T")[0], // Save current date
  };

  notes.push(newNote);
  saveNotesToStorage(notes);
  addNoteToUI(newNote);

  noteInput.value = ""; // Clear the input
});

// Render all notes
function renderNotes(notes) {
  noteList.innerHTML = ""; // Clear existing notes
  notes.forEach((note) => addNoteToUI(note));
}

// Add a single note to the UI
function addNoteToUI(note) {
  const li = document.createElement("li");
  li.dataset.id = note.id;
  li.className = "note-item";

  // Create a span for the note text (or link if it's a URL)
  const noteText = document.createElement("span");
  noteText.className = "note-text";

  // Check if the content is a URL
  if (isURL(note.content)) {
    const link = document.createElement("a");
    link.href = note.content.startsWith("http")
      ? note.content
      : "https://" + note.content;
    link.textContent = note.content;
    link.target = "_blank"; // Open in new tab
    link.rel = "noopener noreferrer"; // Security best practice
    link.className = "note-link";
    noteText.appendChild(link);
  } else {
    noteText.textContent = note.content;
  }

  // Create a container for controls
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "note-controls";
  controlsContainer.style.display = "none"; // Hidden by default

  // Create Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = note.content;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";

    li.innerHTML = ""; // Clear current content
    li.appendChild(input);
    li.appendChild(saveBtn);

    saveBtn.addEventListener("click", () => {
      const newContent = input.value.trim();
      if (!newContent) return alert("Note content cannot be empty.");

      const notes = getNotesFromStorage();
      const noteToUpdate = notes.find((n) => n.id === note.id);
      noteToUpdate.content = newContent;

      saveNotesToStorage(notes);
      renderNotes(notes);
    });
  });

  // Create Delete button with two confirmations (no timeout)
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  let deleteClickCount = 0;
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the note text click
    deleteClickCount++;

    if (deleteClickCount === 1) {
      deleteBtn.textContent = "Click again to confirm";
    } else if (deleteClickCount === 2) {
      deleteBtn.textContent = "Click once more to delete";
    } else if (deleteClickCount >= 3) {
      const notes = getNotesFromStorage();
      const updatedNotes = notes.filter((n) => n.id !== note.id);
      saveNotesToStorage(updatedNotes);
      renderNotes(updatedNotes);
    }
  });

  // Create Save and Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Save and Remove";
  removeBtn.addEventListener("click", () => {
    li.remove(); // Remove the note from the UI only
  });

  // Add controls to container
  controlsContainer.appendChild(editBtn);
  controlsContainer.appendChild(deleteBtn);
  controlsContainer.appendChild(removeBtn);

  // Add click event to the list item (bullet area) to toggle controls
  li.addEventListener("click", (e) => {
    // Only toggle if clicking on the li itself (the bullet area) or note-text span (but not links)
    if (e.target === li || (e.target === noteText && !isURL(note.content))) {
      // Hide all other controls first
      document.querySelectorAll(".note-controls").forEach((controls) => {
        if (controls !== controlsContainer) {
          controls.style.display = "none";
        }
      });

      // Toggle current controls
      if (controlsContainer.style.display === "none") {
        controlsContainer.style.display = "inline";
      } else {
        controlsContainer.style.display = "none";
      }
    }
  });

  li.appendChild(noteText);
  li.appendChild(controlsContainer);
  noteList.appendChild(li);
}

// Filter notes by text
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();
  const notes = getNotesFromStorage();
  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchText)
  );
  renderNotes(filteredNotes);
});

// Filter notes by date
dateInput.addEventListener("change", () => {
  const selectedDate = dateInput.value;
  const notes = getNotesFromStorage();
  const filteredNotes = notes.filter(
    (note) => note.created_at === selectedDate
  );
  renderNotes(filteredNotes);
});

const clearUIBtn = document.getElementById("clearUIBtn");

clearUIBtn.addEventListener("click", () => {
  noteList.innerHTML = ""; // Clear all notes from the UI
});

// View All notes button
viewAllBtn.addEventListener("click", () => {
  const notes = getNotesFromStorage();
  renderNotes(notes);
  searchInput.value = ""; // Clear search input
  dateInput.value = ""; // Clear date input
});
