let ColorTheme = document.querySelector(".color-theme"),
  ul = document.createElement("ul"),
  li,
  Colors = [
    "blue",
    "black",
    "brown",
    "red",
    "yellow",
    "#e91e63",
    "#009688",
    "#ffffff4d",
  ],
  SaveInfo = [],
  input = document.querySelector(".text"),
  but = document.querySelector(".plus"),
  TasksContainer = document.querySelector(".tasks-content"),
  NOtasksMsg = document.querySelector(".no-tasks-message"),
  TaskCount = document.querySelector(".tasks-count span"),
  CompletedTask = document.querySelector(".tasks-completed span"),
  placeHolder = input.getAttribute("placeholder"),
  count,
  i = 0;
Colors.forEach((color, index) => {
  li = document.createElement("li");
  li.setAttribute("data-color", Colors[index]);
  li.style.cssText = `background-color:${Colors[index]}`;
  ul.appendChild(li);
});
ColorTheme.appendChild(ul);
document.querySelector("[data-color='blue']").classList.add("active");

let liList = document.querySelectorAll("ul li");

liList.forEach((li) => {
  li.addEventListener("click", ChangeColor);
});
if (window.localStorage.getItem("Theme-color")) {
  document.documentElement.style.setProperty(
    "--main-color",
    window.localStorage.getItem("Theme-color")
  );
  liList.forEach((li) => {
    li.classList.remove("active");
  });
  document
    .querySelector(
      `[data-color="${window.localStorage.getItem("Theme-color")}"]`
    )
    .classList.add("active");
} else {
  window.localStorage.theme =
    document.documentElement.style.getPropertyValue("--main-color");
}
function ChangeColor(event) {
  liList.forEach((li) => {
    li.classList.remove("active");
  });
  event.target.classList.add("active");
  if (event.target.getAttribute("data-color")) {
    document.documentElement.style.setProperty(
      "--main-color",
      event.target.getAttribute("data-color")
    );
    window.localStorage.setItem(
      "Theme-color",
      document.documentElement.style.getPropertyValue("--main-color")
    );
  }
}

if (window.localStorage.Task) {
  SaveInfo = JSON.parse(window.localStorage.Task);
}
GetDATAFromLocalStorage();
window.addEventListener("load", () => {
  if (TasksContainer.childElementCount == 0) {
    NoTasks();
  }
  ClearALL();
  Calc();
  input.setAttribute("placeholder", "");
  count = setInterval(() => {
    input.placeholder += placeHolder[i];
    i++;
    if (i > placeHolder.length - 1) {
      clearInterval(count);
    }
  }, 600);
});
input.addEventListener("blur", () => {
  input.placeholder = placeHolder;
  clearInterval(count);
});
but.addEventListener("click", (e) => {
  e.preventDefault();

  if (input.value != "") {
    AddTaskINFO(input.value);
    ClearALL();
    Calc();
    input.value = "";
  }
});
TasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    DeleteFromLocalStorage(e.target.parentElement.getAttribute("id"));
    e.target.parentElement.remove();
    if (TasksContainer.childElementCount == 0) {
      NoTasks();
    }
  }
  if (e.target.parentElement.classList.contains("task-box")) {
    ToggleElementINLocalStorage(e.target.parentElement.getAttribute("id"));
    e.target.parentElement.classList.toggle("finished");
  }
  ClearALL();
  Calc();
});

function AddTaskINFO(info) {
  const data = {
    id: Date.now(),
    title: info,
    completed: false,
  };
  SaveInfo.push(data);

  ADDINFOTOPAGE(SaveInfo);

  SaveDATAToLocalStorage(SaveInfo);
}
function ADDINFOTOPAGE(info) {
  if (document.body.contains(document.querySelector(".no-tasks-message"))) {
    NOtasksMsg.remove();
  }
  TasksContainer.innerHTML = "";
  SaveInfo.forEach((data) => {
    let div = document.createElement("div"),
      but = document.createElement("button"),
      pra = document.createElement("p");
    div.className = "task-box";
    but.className = "delete";
    pra.innerHTML = data.title;
    but.innerHTML = "Delete";
    div.id = data.id;
    if (data.completed) {
      div.className = "task-box finished";
    }
    div.append(pra, but);
    TasksContainer.appendChild(div);
  });
}
function SaveDATAToLocalStorage(Info) {
  window.localStorage.setItem("Task", JSON.stringify(Info));
}
function GetDATAFromLocalStorage(info) {
  if (window.localStorage.Task) {
    let Tasks = JSON.parse(window.localStorage.Task);
    ADDINFOTOPAGE(Tasks);
  }
}
function DeleteFromLocalStorage(info) {
  SaveInfo = SaveInfo.filter((same) => same.id != info);
  SaveDATAToLocalStorage(SaveInfo);
}
function ToggleElementINLocalStorage(info) {
  SaveInfo.forEach((InfoId) => {
    if (InfoId.id == info) {
      InfoId.completed == false
        ? (InfoId.completed = true)
        : (InfoId.completed = false);
    }
  });
  SaveDATAToLocalStorage(SaveInfo);
}
function Calc() {
  TaskCount.innerHTML = document.querySelectorAll(
    ".tasks-content .task-box"
  ).length;
  CompletedTask.innerHTML = document.querySelectorAll(
    ".tasks-content .finished"
  ).length;
}
function NoTasks() {
  if (document.body.contains(document.querySelector(".no-tasks-message"))) {
    NOtasksMsg.remove();
  }
  let span = document.createElement("span");
  span.innerHTML = "No Tasks To Show";
  span.className = "no-tasks-message";
  TasksContainer.append(span);
}
function ClearALL() {
  document.querySelector(".tasks-clear span").innerHTML =
    document.querySelectorAll(".tasks-content .task-box").length;
  if (
    TasksContainer.childElementCount != 0 &&
    TasksContainer.childElementCount >= 2
  ) {
    document.querySelector(".tasks-clear").style.display = "block";
  } else {
    document.querySelector(".tasks-clear").style.display = "none";
  }
  let Clear = document.querySelector(".tasks-clear");
  Clear.addEventListener("click", () => {
    window.localStorage.removeItem("Task");
    TasksContainer.innerHTML = NOtasksMsg.textContent;
    SaveInfo = [];
    document.querySelector(".tasks-clear").style.display = "none";
    Calc();
  });
}
