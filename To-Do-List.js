let container = document.querySelector(".container");
let form = document.querySelector(".form");
let input1 = document.querySelector(".input");
let input2 = document.querySelector(".add");
let result = document.querySelector(".tasks");

let ArrayToTask = [];
let el = document.querySelectorAll("ul li");
let classeslist = [];
for (let i = 0; i < el.length; i++) {
  classeslist.push(el[i].getAttribute("data-color"));
  el[i].addEventListener("click", thChange);
}
if (window.localStorage.theme) {
  document.documentElement.style.setProperty(
    "--main-color",
    window.localStorage.theme
  );
  el.forEach((li) => {
    li.classList.remove("active");
  });
  document
    .querySelector(`[data-color="${window.localStorage.getItem("theme")}"]`)
    .classList.add("active");
} else {
  window.localStorage.theme =
    document.documentElement.style.getPropertyValue("--main-color");
}
function thChange(event) {
  var comp = event.target;
  el.forEach((li) => {
    li.classList.remove("active");
  });
  comp.classList.add("active");
  if (comp.getAttribute("data-color") === "red") {
    document.documentElement.style.setProperty("--main-color", "red");
  } else if (comp.getAttribute("data-color") === "green") {
    document.documentElement.style.setProperty("--main-color", "green");
  } else if (comp.getAttribute("data-color") === "blue") {
    document.documentElement.style.setProperty("--main-color", "blue");
  } else if (comp.getAttribute("data-color") === "black") {
    document.documentElement.style.setProperty("--main-color", "black");
  }
  window.localStorage.theme =
    document.documentElement.style.getPropertyValue("--main-color");
}

el[0].style.cssText = `
 background-color:red;
`;
el[1].style.cssText = `
 background-color:green;
`;
el[2].style.cssText = `
 background-color:blue;
`;
el[3].style.cssText = `
 background-color:black;
`;
// check if there is data in localStorage

if (localStorage.getItem("tasks")) {
  ArrayToTask = JSON.parse(localStorage.getItem("tasks"));
}

// get data from localStorage
getTaskTolocalStorage();

input2.addEventListener("click", (e) => {
  e.preventDefault();
  if (input1.value !== "") {
    addTask(input1.value);
  }
  input1.value = "";
});
result.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    // remove Element from localstorage
    deletetaskfromLocalStorage(e.target.parentElement.getAttribute("data-id"));
    // remove Element
    e.target.parentElement.remove();
  }
  if (e.target.classList.contains("task")) {
    togglestattutaskfromLocalStorage(
      e.target.parentElement.getAttribute("data-id")
    );

    // toggle done class
    e.target.classList.toggle("done");
  }
});

container.style.cssText = `
    width: 50%;
    margin: 50px auto;
`;
form.style.cssText = `
    padding: 20px;
    background-color: rgb(238, 238, 238);
    border-radius: 10px;;
    display: flex;
    flex-wrap: nowrap;
`;

input1.style.cssText = `
    outline:none;
    color: black;
    font-size: 14px;
    padding: 8px;
    border-radius: 10px;
    border:none;
    width:80%;`;

input2.style.cssText = `
    background-color:var(--main-color);
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 8px;
    margin-left: 8px;
    border-radius: 10px;
    cursor:pointer;`;
result.style.cssText = `
    margin-top: 20px;
    padding: 20px;
    background-color: rgb(238, 238, 238);
    border-radius: 10px;`;

function addTask(taskText) {
  // task data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // push tasks to array
  ArrayToTask.push(task);

  // added tasks to page
  addElementToPageForm(ArrayToTask);

  // add Task To localStorage
  addTaskTolocalStorage(ArrayToTask);
}
function addElementToPageForm(ArrayToTask) {
  //  empty result
  result.innerHTML = "";
  // loop on array of tasks
  ArrayToTask.forEach((task) => {
    // create main div

    let div = document.createElement("div");
    div.className = "task";
    let pra = document.createElement("p");

    // check if task completed
    if (task.completed) {
      div.className = "task done";
    }
    div.setAttribute("data-id", task.id);
    // div.appendChild(document.createTextNode(task.title));
    pra.textContent = task.title;
    // create delete buttom
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));
    div.append(pra, span);
    result.appendChild(div);
    div.style.cssText = `
    border-left: 4px solid var(--main-color);
    display: flex;
    background-color: white;
    align-items: center;
    padding: 6px;
        margin-bottom: 10px;


`;
    pra.style.cssText = `
    overflow-wrap: anywhere;
    padding-left:10px;
        flex-basis: 90%;
`;
    span.style.cssText = `
    font-size: 12px;
    background-color: var(--main-color);
    color: white;
    cursor: pointer;
    margin: 5px;
    padding: 6px;
    border-radius: 6px;
            flex-basis: 10%;
`;
  });
}
function addTaskTolocalStorage(ArrayToTask) {
  window.localStorage.setItem("tasks", JSON.stringify(ArrayToTask));
}
function getTaskTolocalStorage(ArrayToTask) {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementToPageForm(tasks);
  }
}
function deletetaskfromLocalStorage(taskId) {
  ArrayToTask = ArrayToTask.filter((task) => task.id != taskId);
  addTaskTolocalStorage(ArrayToTask);
}
function togglestattutaskfromLocalStorage(taskId) {
  for (i = 0; i < ArrayToTask.length; i++) {
    if (ArrayToTask[i].id == taskId) {
      ArrayToTask[i].completed == false
        ? (ArrayToTask[i].completed = true)
        : (ArrayToTask[i].completed = false);
    }
  }
  addTaskTolocalStorage(ArrayToTask);
}
