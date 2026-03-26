let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

Notification.requestPermission();

// ADD TASK
function addTask(nameFromVoice = null) {
  const nameInput = document.getElementById("taskName");
  const name = nameFromVoice || nameInput.value;
  const category = document.getElementById("taskCategory").value;
  const time = document.getElementById("taskTime").value;

  if (!name || !time) return alert("Fill all fields");

  const task = {
    id: Date.now(),
    name,
    category,
    time,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  nameInput.value = "";
}

// SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// RENDER
function renderTasks() {
  const list = document.getElementById("listView");
  const search = document.getElementById("search").value.toLowerCase();

  list.innerHTML = "";

  tasks.forEach(task => {
    if (!task.name.toLowerCase().includes(search)) return;

    const div = document.createElement("div");
    div.className = "task";

    if (task.completed) div.classList.add("completed");

    div.innerHTML = `
      <span onclick="toggleTask(${task.id})">
        ${task.name} (${task.category}) - ${task.time}
      </span>
      <button onclick="deleteTask(${task.id})">X</button>
    `;

    list.appendChild(div);
  });
}

// TOGGLE
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// DELETE
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// 🔔 NOTIFICATIONS
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5);

  tasks.forEach(task => {
    if (task.time === currentTime && !task.completed) {
      new Notification("Reminder", { body: task.name });
    }
  });
}, 60000);

// 🎤 VOICE INPUT
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function(event) {
    const voiceText = event.results[0][0].transcript;
    addTask(voiceText);
  };
}

// VIEWS
function showList() {
  document.getElementById("listView").style.display = "block";
  document.getElementById("calendarView").style.display = "none";
}

function showCalendar() {
  const cal = document.getElementById("calendarView");
  cal.innerHTML = "<h3>Today</h3>";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `${task.name} - ${task.time}`;
    cal.appendChild(div);
  });

  document.getElementById("listView").style.display = "none";
  cal.style.display = "block";
}

// INIT
renderTasks();