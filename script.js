document.addEventListener("DOMContentLoaded", function() {
  loadTasksFromLocalStorage();
});

function addTask(taskText = "", isCompleted = false) {
  var taskInput = document.getElementById("taskInput");
  var taskList = document.getElementById("taskList");

  var taskValue = taskText || taskInput.value.trim();
  if (taskValue === "") {
    alert("Please enter a task.");
    return;
  }

  var li = document.createElement("li");
  li.draggable = true;
  li.ondragstart = handleDragStart;
  li.ondragover = handleDragOver;
  li.ondrop = handleDrop;
  li.ondragend = handleDragEnd;

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;
  checkbox.onchange = function() {
    if (checkbox.checked) {
      span.classList.add("completed");
    } else {
      span.classList.remove("completed");
    }
    saveTasksToLocalStorage();
  };
  li.appendChild(checkbox);

  var span = document.createElement("span");
  span.innerText = taskValue;
  if (isCompleted) {
    span.classList.add("completed");
  }
  li.appendChild(span);

  var deleteButton = document.createElement("button");
  deleteButton.innerText = "🗑️"; // Trash can icon
  deleteButton.className = "taskDeleteButton";
  deleteButton.onclick = function() {
    li.remove();
    saveTasksToLocalStorage();
  };
  li.appendChild(deleteButton);

  var editButton = document.createElement("button");
  editButton.innerHTML = "✏️"; // Pencil icon
  editButton.className = "taskEditButton";
  editButton.onclick = function() {
    var newTask = prompt("Edit the task:", span.innerText);
    if (newTask !== null) {
      span.innerText = newTask;
      saveTasksToLocalStorage();
    }
  };
  li.appendChild(editButton);

  taskList.appendChild(li);
  taskInput.value = "";

  saveTasksToLocalStorage();
}

function deleteAllTasks() {
  var taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
}

function saveTasksToLocalStorage() {
  var taskList = document.getElementById("taskList");
  var tasks = [];
  Array.from(taskList.children).forEach(function(li) {
    var checkbox = li.querySelector("input[type='checkbox']");
    var span = li.querySelector("span");
    tasks.push({ text: span.innerText, completed: checkbox.checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  var savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    JSON.parse(savedTasks).forEach(function(task) {
      addTask(task.text, task.completed);
    });
  }
}

function handleDragStart(e) {
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
  e.preventDefault();
  var draggingItem = document.querySelector('.dragging');
  var taskList = document.getElementById("taskList");
  var target = e.target.closest('li');
  if (target && draggingItem !== target) {
    var rect = target.getBoundingClientRect();
    var next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
    taskList.insertBefore(draggingItem, next && target.nextSibling || target);
    saveTasksToLocalStorage();
  }
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}
