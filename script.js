const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");

// Load saved todos from localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editingId = null;

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// CREATE
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text: text, done: false });
  input.value = "";
  save();
  render();
});

// UPDATE: toggle done
function toggleDone(id) {
  todos = todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));
  save();
  render();
}

// UPDATE: edit text
function startEdit(id) {
  editingId = id;
  render();
}

function saveEdit(id, newText) {
  const text = newText.trim();
  if (text) {
    todos = todos.map(t => (t.id === id ? { ...t, text: text } : t));
    save();
  }
  editingId = null;
  render();
}

// DELETE
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

// READ: draw the list
function render() {
  list.innerHTML = "";
  emptyMsg.style.display = todos.length ? "none" : "block";

  todos.forEach(todo => {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleDone(todo.id));
    li.appendChild(checkbox);

    if (editingId === todo.id) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = todo.text;
      editInput.className = "edit-input";
      editInput.addEventListener("keydown", e => {
        if (e.key === "Enter") saveEdit(todo.id, editInput.value);
        if (e.key === "Escape") {
          editingId = null;
          render();
        }
      });
      li.appendChild(editInput);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "edit-btn";
      saveBtn.addEventListener("click", () => saveEdit(todo.id, editInput.value));
      li.appendChild(saveBtn);

      setTimeout(() => editInput.focus(), 0);
    } else {
      const span = document.createElement("span");
      span.textContent = todo.text;
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => startEdit(todo.id));
      li.appendChild(editBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => deleteTodo(todo.id));
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

render();
