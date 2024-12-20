// DOM Elements
const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteList = document.getElementById("noteList");
const searchInput = document.getElementById("searchInput");
const dateInput = document.getElementById("dateInput");

// Load notes when the page loads
document.addEventListener("DOMContentLoaded", loadNotes);

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
    notes.forEach(note => addNoteToUI(note));
}

// Add a single note to the UI
function addNoteToUI(note) {
    const li = document.createElement("li");
    li.dataset.id = note.id;
    li.textContent = note.content;

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
            const noteToUpdate = notes.find(n => n.id === note.id);
            noteToUpdate.content = newContent;

            saveNotesToStorage(notes);
            renderNotes(notes);
        });
    });

    // Create Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        const notes = getNotesFromStorage();
        const updatedNotes = notes.filter(n => n.id !== note.id);
        saveNotesToStorage(updatedNotes);
        renderNotes(updatedNotes);
    });

    // Create Save and Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Save and Remove";
    removeBtn.addEventListener("click", () => {
        li.remove(); // Remove the note from the UI only
    });

    

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(removeBtn);
    noteList.appendChild(li);
}

// Filter notes by text
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const notes = getNotesFromStorage();
    const filteredNotes = notes.filter(note =>
        note.content.toLowerCase().includes(searchText)
    );
    renderNotes(filteredNotes);
});

// Filter notes by date
dateInput.addEventListener("change", () => {
    const selectedDate = dateInput.value;
    const notes = getNotesFromStorage();
    const filteredNotes = notes.filter(note => note.created_at === selectedDate);
    renderNotes(filteredNotes);
});

const clearUIBtn = document.getElementById("clearUIBtn");

clearUIBtn.addEventListener("click", () => {
    noteList.innerHTML = ""; // Clear all notes from the UI
});