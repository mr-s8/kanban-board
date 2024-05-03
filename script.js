const AllColumns = document.querySelector(".columns")
showData();


const taskFields = document.querySelectorAll(".task")
const dropFields = document.querySelectorAll(".column")


const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dropdownMenu = document.getElementById("dropdown");

const deleteField = document.getElementById("delete-area")

let columnNames = {}  // this dict stores the column names and the corresponding id



function updateColumns() {
    // this function checks which columns exist and then updates the select dropdown menu at the top
    columnNames = {}
    dropdownMenu.innerHTML = ""
    dropFields.forEach((e) => {
        columnName = e.querySelector("h3").textContent;
        columnNames[columnName] = e.id
        dropdownMenu.innerHTML += "<option>" + columnName + "</option>"
    });
    console.log(columnNames)
}

taskFields.forEach((task) => {        // initialize drag and drop behavior
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging")
        saveData();
    })
    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging")
        saveData();
    })
});


dropFields.forEach((zone) => {  // initialize drag and drop behavior
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(zone, e.clientY);
        const curTask = document.querySelector(".is-dragging");

        if (!bottomTask) {
            zone.appendChild(curTask);
        } else {
            zone.insertBefore(curTask, bottomTask);
        }
        saveData();
    });
});

deleteField.addEventListener("dragover", (e) => {  // initialise drag and drop behavior of delete field
    e.preventDefault();
    const curTask = document.querySelector(".is-dragging");
    if (curTask === null) {
        return
    } else {
        curTask.remove()
    }
    saveData();

});


updateColumns();  // update the select box with the initial columns

form.addEventListener("submit", (e) => {        // on submit add task to selected column
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = value;

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
    });

    let selectedMenuEntry = dropdownMenu.options[dropdownMenu.selectedIndex].text
    console.log(selectedMenuEntry)
    let selectedLane = document.getElementById(columnNames[selectedMenuEntry])
    selectedLane.appendChild(newTask);

    input.value = "";
    saveData();
});

const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
};

function saveData() {
    localStorage.setItem("data", AllColumns.innerHTML);
}

function showData() {
    AllColumns.innerHTML = localStorage.getItem("data");
}