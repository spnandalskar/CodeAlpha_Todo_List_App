// 1. DOM 
const taskContainers = document.querySelectorAll("div.taskContainer");
const dismissBtn = document.querySelector("svg.lucide-circle-x");

// Global Variable
let taskId = 1;

// 2. Event listeners
taskContainers.forEach((container) => {
    const taskList = container.querySelector("ul.taskList");
    const addBtn = container.querySelector("svg.lucide-circle-plus");
    const saveBtn = container.querySelector("svg.lucide-circle-check");

    // events for per section
    // add task item
    addBtn.addEventListener("click", () => {
        if (isEmptyTask(taskList)) createTaskItem(taskList, "");
    })

    // save task
    saveBtn.addEventListener("click", () => {
        saveTaskToLocalStorage(container);
    })

    // Delegate clicks inside taskList
    taskList.addEventListener("click", (e) => {
        const li = e.target.closest("li.taskListItem");
        if (!li) return;

        const unchecked = li.querySelector("svg.lucide-square");
        const checked = li.querySelector("svg.lucide-square-check");
        const taskInputText = li.querySelector("textarea.checkboxText");
        const removeBtn = li.querySelector("svg.lucide-x");

        // change span to textarea
        taskInputText.addEventListener("input", () => {
            autoResizeTextarea(taskInputText);
            updateTaskIcons(li, taskInputText);
        });

        // checkbox functionality
        if (e.target === unchecked) {
            unchecked.style.display = "none";
            checked.style.display = "block";
            taskInputText?.classList.add("isChecked");
        } else if (e.target.classList.contains("checkedIcon")) {
            checked.style.display = "none";
            unchecked.style.display = "block";
            taskInputText?.classList.remove("isChecked");
        }

        // remove btn functionality 
        if (e.target === removeBtn) {
            removeTaskItem(li, taskList);
        }

    })
})

dismissBtn.addEventListener("click", () => {
    dismissTask();
})

// 3. Functions
// create elemenet with attributes
function createElementwithAttributes(tag, attributes = {}, textContent = "") {
    const element = document.createElement(tag);

    // Set all attributes
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));

    // Text content
    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

// create new task item
function createTaskItem(taskList, content = "", isChecked = false) {
    const template = document.getElementById("taskTemplate");
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector("li.taskListItem");
    const textarea = li.querySelector("textarea.checkboxText");

    textarea.value = content;
    textarea.id = "task" + taskId;

    const checkedIcon = li.querySelector(".lucide-square-check");
    const uncheckedIcon = li.querySelector(".lucide-square");

    if (isChecked) {
        checkedIcon.style.display = "block";
        uncheckedIcon.style.display = "none";
        textarea.classList.add("isChecked");
    }

    taskList.appendChild(clone);

    textarea.addEventListener("input", () => {
        autoResizeTextarea(textarea);
        updateTaskIcons(li, textarea);
    });

    updateTaskIcons(li, textarea);

    taskId++;
}

// autoResize the Textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

// update Task icons
function updateTaskIcons(li, textarea) {
    const uncheckedIcon = li.querySelector("svg.lucide-square");
    const checkedIcon = li.querySelector("svg.lucide-square-check");
    const plusIcon = li.querySelector("svg.lucide-plus");

    const handleplusIcon = textarea.classList.contains("isChecked") && textarea.value.trim() !== "";
    const handleUnchecked = !textarea.classList.contains("isChecked") && textarea.value.trim() !== "";
    const handleChecked = textarea.classList.contains("isChecked") && textarea.value.trim() === "";

    if (handleUnchecked) {
        plusIcon.style.display = "none";
        uncheckedIcon.style.display = "block";
    } else if (handleplusIcon) {
        plusIcon.style.display = "none";
    } else {
        uncheckedIcon.style.display = "none";
        plusIcon.style.display = "block";
    }

    if (handleChecked) {
        checkedIcon.style.display = "none";
        textarea.classList.remove("isChecked");
        plusIcon.style.display = "block";
    }

}

// remove task item
function removeTaskItem(li, taskList) {
    if (taskList.children.length > 1) {
        li.remove();
    } else {
        createTaskItem(taskList);
        li.remove();
    }
}

// check if there is empty task
function isEmptyTask(taskList) {
    const listItems = [...taskList.querySelectorAll("li.taskListItem")];

    const hasEmptyTask = listItems.some((li) => {
        const textarea = li.querySelector("textarea.checkboxText");
        const text = (textarea?.value || "").trim();

        return text === "";
    });

    if (hasEmptyTask) {
        alert("Fill the empty task.");
        return false;
    }
    return true;
}

//bind events to container 
function bindEventsToContainer(container) {
    const taskList = container.querySelector("ul.taskList");
    const addBtn = container.querySelector("svg.lucide-circle-plus");
    const saveBtn = container.querySelector("svg.lucide-circle-check");

    // Add task item
    addBtn.addEventListener("click", () => {
        if (isEmptyTask(taskList)) createTaskItem(taskList);
    });

    // Save task
    saveBtn.addEventListener("click", () => {
        saveTaskToLocalStorage(container);
    });

    // Delete Task
    const deleteBtn = container.querySelector(".deleteBtnWrapper");
    const savedTaskContainer = document.querySelector(".savedTaskContainer");

    deleteBtn.addEventListener("click", () => {
        const containerId = container.getAttribute("data-id");
        if (!containerId) return;

        const confirmDelete = confirm("Are you sure you want to delete this task list?");
        if (!confirmDelete) return;

        localStorage.removeItem(containerId);
        container.remove();

        const allTaskContainers = savedTaskContainer.querySelectorAll(".taskContainer");
        if (allTaskContainers.length === 0) {
            const spanText = document.createElement("span");
            spanText.textContent = "No saved tasks yet";
            savedTaskContainer.appendChild(spanText);
        }

    });


    // Click delegation
    taskList.addEventListener("click", (e) => {
        const li = e.target.closest("li.taskListItem");
        if (!li) return;

        const unchecked = li.querySelector("svg.lucide-square");
        const checked = li.querySelector("svg.lucide-square-check");
        const taskInputText = li.querySelector("textarea.checkboxText");
        const removeBtn = li.querySelector("svg.lucide-x");

        if (e.target === unchecked) {
            unchecked.style.display = "none";
            checked.style.display = "block";
            taskInputText?.classList.add("isChecked");
        } else if (e.target.classList.contains("checkedIcon")) {
            checked.style.display = "none";
            unchecked.style.display = "block";
            taskInputText?.classList.remove("isChecked");
        }

        if (e.target === removeBtn) {
            removeTaskItem(li, taskList);
        }
    });

    // Expand Task Container 
    container.addEventListener("click", () => {
        if (container.classList.contains("savedTaskWrapper")) {
            const taskList = container.querySelector("ul.taskList");
            const buttonWrapper = container.querySelector("div.taskButtonWrapper");
            taskList.style.display = "block";
            buttonWrapper.style.height = "2rem";
            buttonWrapper.style.padding = "0.25rem";
        }
    })


}

// render or update the exisiting container
function renderOrUpdateSavedContainer(containerId, title, tasks) {
    let container = document.querySelector(`.savedTaskContainer .taskContainer[data-id="${containerId}"]`);

    if (!container) {
        const template = document.getElementById("savedTaskTemplate");
        const clone = template.content.cloneNode(true);
        container = clone.querySelector(".taskContainer");
        container.setAttribute("data-id", containerId);

        const savedTaskContainer = document.querySelector(".savedTaskContainer");
        const spanText = savedTaskContainer.querySelector("span");

        if (spanText?.textContent) {
            spanText?.remove();
        }

        savedTaskContainer.appendChild(container);
        bindEventsToContainer(container);
    }


    const titleInput = container.querySelector("input.taskTitle");
    const taskList = container.querySelector("ul.taskList");
    titleInput.value = title;
    taskList.innerHTML = "";

    tasks.forEach((task) => createTaskItem(taskList, task.content, task.isChecked));
}

// save task 
function saveTaskToLocalStorage(container) {
    const containerId = container.getAttribute("data-id") || `taskContainer-${Date.now()}`;
    container.setAttribute("data-id", containerId);

    const title = container.querySelector("input.taskTitle").value.trim();
    const taskList = container.querySelector("ul.taskList");

    if (title === "") {
        alert("Fill the Empty title.");
        return;
    }

    if (!isEmptyTask(taskList)) return;

    const taskItems = taskList.querySelectorAll("li.taskListItem");
    const tasks = [...taskItems].map((li) => {
        const textarea = li.querySelector("textarea.checkboxText");
        const isChecked = textarea?.classList.contains("isChecked");

        return {
            id: textarea?.id,
            content: (textarea?.value || "").trim(),
            isChecked: !!isChecked,
        }
    });

    alert("Task saved for: " + title);
    localStorage.setItem(containerId, JSON.stringify({ title, tasks }));
    renderOrUpdateSavedContainer(containerId, title, tasks);
    if (container.classList.contains("newTaskWrapper")) {
        resetNewTaskWrapper(container);
    }
}

// dimiss new Task
function dismissTask() {
    const container = document.querySelector(".newTaskWrapper");
    const titleInput = container.querySelector("input.taskTitle");
    const taskList = container.querySelector("ul.taskList");

    if (titleInput === "") {
        alert("Fill the Empty title.");
        return;
    }
    if (!isEmptyTask(taskList)) return;

    const isConfirm = confirm("Do you want to dismiss the task ?");
    if (isConfirm) {
        titleInput.value = "";
        taskList.innerHTML = "";
        createTaskItem(taskList);
    }
}

// reset new task wrapper
function resetNewTaskWrapper(container) {
    const titleInput = container.querySelector("input.taskTitle");
    const taskList = container.querySelector("ul.taskList");

    titleInput.value = "";
    titleInput.focus();

    taskList.innerHTML = "";

    createTaskItem(taskList, "");
}



// Load all containers on page load
function loadAllFromLocalStorage() {
    Object.keys(localStorage).forEach((key) => {
        try {
            const { title, tasks } = JSON.parse(localStorage.getItem(key));
            if (title && Array.isArray(tasks)) {
                renderOrUpdateSavedContainer(key, title, tasks);
            }
        } catch (e) {
            console.error("Invalid localStorage entry:", key);
        }
    });
}

// initiate

window.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector("input.taskTitle");
    title.focus();
    title.setSelectionRange(title.value.length, title.value.length);
    loadAllFromLocalStorage();
})
