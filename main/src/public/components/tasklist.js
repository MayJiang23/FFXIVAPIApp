/* eslint-disable no-unused-vars */
import { checkTask, createTask, deleteTask, editTaskDesc, getTaskSummary, getTasks } from '../services/tasklistServices.js';
import { ToggleDisplay } from './displayUtil.js';
import { BuildModal } from './modal.js';

function validateTaskInput(input, title = "Tasklist Error") {
    if (!input.trim()) {
      BuildModal({ title, children: "Input is empty! Try again." });
      return false;
    }
    return true;
};

function tasklistErrorHandler(title = "Tasklist Error", message) {
    BuildModal({ title: "Tasklist Add Error", children: message });
    return;
}
  

/**
 * InitTaskList
 * Initiate the task list
 */
async function InitTaskList() {

    const initTaskContainer = document.createElement('div');
    initTaskContainer.className = "tasklist-init";
    
    // Creating the tasklist div
    const tasklistDiv = document.createElement("div");
    tasklistDiv.id = "tasklist-container";

    // Creating the fold button in the tasklist
    const foldButton = document.createElement("img");
    foldButton.classList.add("expand");
    foldButton.src = "icons/fold.png";
    foldButton.style.width = "20";
    foldButton.alt = "Tasklist Fold Button";
    foldButton.classList.add("tasklist-display-button", "expand");


    foldButton.onload = () => {
        tasklistDiv.className = "hide";
    }

    foldButton.onclick = () => {
        const hidden = tasklistDiv.classList.contains('hide');
        ToggleDisplay(tasklistDiv, hidden);
        foldButton.classList.toggle('expanded', hidden);
    }
    
    // Creating the header of the task list
    const tasklistHeader = document.createElement("div");
    tasklistHeader.id = "tasklist-header";
    tasklistHeader.innerHTML = `
        <h1>Task List</h1>
    `;
    
    /**             TASKLIST            **/
    const tasklist = document.createElement("ul");
    tasklist.className = "taskList";
    tasklist.id = "taskBullets";
    //Check the task list by clicking task item
    tasklist.addEventListener('click', async function (ev) {
        if (ev.target.tagName === 'LI' || ev.target.classList.contains('taskText')) {
            let item_id = ev.target.dataset.id;
            let is_completed = (ev.target.classList.contains('checked'));
            try {
                await checkTask(item_id, is_completed);    // Sync in the database
                await UpdateTasklistSummary();            
                ev.target.classList.toggle('checked'); //For style purposes
            } catch (error) {
                tasklistErrorHandler("Tasklist Add Error", error.message );
                return;
            }
        }
    }, false);

    //Add task section
    const addTaskListDiv = document.createElement("div");
    addTaskListDiv.id = "tasklist-add-task-container";
    //The add task list button
    const addTaskListIcon = document.createElement("img");
    addTaskListIcon.alt = "Add Task Icon";
    addTaskListIcon.src = "icons/add.png";
    addTaskListIcon.width = "20";
    addTaskListIcon.className = "tasklist-add-task-icon";
    //The task input box container
    const taskTextBoxDiv = document.createElement("div");
    taskTextBoxDiv.id = "tasklist-add-task-text-box";
    taskTextBoxDiv.className = "hide";  //Hide the task text container initially
    //Create the actual input box
    const taskTextBox = document.createElement("input");
    taskTextBox.type = "text";
    taskTextBox.className = "tasklist-add-task-text-input";
    //The enter button for the task input
    const enterTaskButton = document.createElement("img");
    enterTaskButton.src = "icons/check.png";
    enterTaskButton.alt = "Enter Tasklist Icon";
    enterTaskButton.className = "tasklist-add-task-enter";
    //The enter button will add a new task in the task list
    enterTaskButton.onclick = async (e) => {
        await AddTaskToTaskList(taskTextBox.value);
        taskTextBox.value = "";
    };
    //Allow user to enter the input using keyboard
    taskTextBox.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            await AddTaskToTaskList(taskTextBox.value);
        }
    });
    
    //Ensure that everytime the add task icon is clicked,
    //the input container will show and expand the container
    addTaskListIcon.onclick = (e) => {
        if (taskTextBoxDiv.classList.contains("hide")) {
            ToggleDisplay(taskTextBoxDiv, true);
            taskTextBox.focus();
        } else {
            ToggleDisplay(taskTextBoxDiv, false);
        }
    };
    //Append the input box and button to the container
    taskTextBoxDiv.appendChild(taskTextBox);
    taskTextBoxDiv.appendChild(enterTaskButton);
    
    //Append the add task icon and task text box to the container
    addTaskListDiv.appendChild(addTaskListIcon);
    addTaskListDiv.appendChild(taskTextBoxDiv);

    initTaskContainer.appendChild(foldButton);
    initTaskContainer.appendChild(tasklistDiv);
    //Append the tasklist to the body
    tasklistDiv.appendChild(tasklistHeader);
    tasklistDiv.appendChild(tasklist);
    tasklistDiv.appendChild(addTaskListDiv);

    const summaryDiv = document.createElement("span");
    summaryDiv.id = "tasklist-summary";
    tasklistDiv.appendChild(summaryDiv);

    document.body.appendChild(initTaskContainer);

    await RenderInitialTaskList();  // ✅ fetch and append tasks
    await UpdateTasklistSummary();  // ✅ update summary



};

/**
 * AddTaskToTaskList
 * @param { string } taskText 
 */
async function AddTaskToTaskList(taskText) {
    if (!validateTaskInput(taskText, "Tasklist Add Error")) return;
    // Add the data to the database first
    const item_id = await createTask(taskText);
    if (item_id instanceof Error) {
        BuildModal({ title: "Tasklist Add Error", children: `${result.message}` });
        return;
    }
    const taskBullet = CreateTaskElement(taskText, item_id);
    const tasklist = document.getElementById('taskBullets');
    tasklist.appendChild(taskBullet);
    await UpdateTasklistSummary(); 
};

/**
 * AddTaskElement
 * create a single task list in the task list
 * @param {string} taskText - the text input of a single task list
 * @param {number} item_id - the id of the item
 * @returns {Node} taskBullet
 */
function CreateTaskElement(taskText, item_id) {
    if (!validateTaskInput(taskText, "Tasklist Add Error")) return;
    // Init a task bullet 
    const taskBullet = document.createElement("li");
    taskBullet.dataset.id = item_id; //Sets the id in the class name
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.className = "taskText";

    // Sets up the misc functionality that 
    // can edit or delete the bullet
    const miscDiv = document.createElement("div");
    const miscSpan = document.createElement("span");
    miscSpan.textContent = "...";

    // The dropdown for misc
    const miscDropdownDiv = document.createElement("div");
    miscDropdownDiv.className = "task-item-misc-dropdown";
    miscDropdownDiv.classList.add("hide");
    const deleteSpan = document.createElement("div");
    deleteSpan.textContent = "delete";
    deleteSpan.onclick = async (e) => {
        await DeleteTaskInTaskList(item_id);
    };
    const editSpan = document.createElement("div");
    editSpan.onclick = async (e) => {
        await InitUpdateBox(item_id);
    };
    editSpan.textContent = "edit";
    miscDropdownDiv.appendChild(deleteSpan);
    miscDropdownDiv.appendChild(editSpan);

    // Give the misc span the event listener
    // that everytime it is open up, others will close
    // And the dropdown will toggle display
    miscSpan.onclick = (e) => {
        // Close all other open dropdowns first
        document.querySelectorAll(".task-item-misc-dropdown")
        .forEach(dropdown => {
            if (dropdown !== miscDropdownDiv) 
                ToggleDisplay(dropdown, false);
        });
        (miscDropdownDiv.classList.contains("hide")) ? 
            ToggleDisplay(miscDropdownDiv, true) : 
            ToggleDisplay(miscDropdownDiv, false);
    };
    taskBullet.appendChild(taskSpan);
    miscDiv.appendChild(miscSpan);
    miscDiv.appendChild(miscDropdownDiv);
    taskBullet.appendChild(miscDiv);
    return taskBullet;
};

/**
 * DeleteTaskInTaskList
 * Delete a single task in the tasklist
 * @param {number} item_id 
 */
async function DeleteTaskInTaskList(item_id) {
    const taskBullet = document.querySelector(`[data-id="${item_id}"]`);
    if (!taskBullet) {
        BuildModal({ title: "Task Not Found", children: "This task no longer exists." });
        return;
      }
    const confirmDelete = async () => {
        const result = await deleteTask(item_id);
        if (result instanceof Error) {
            BuildModal({ title: "Tasklist Delete Error", children: `${result.message}` });
            return;
        } else {
            taskBullet.remove();
            await UpdateTasklistSummary();
            ToggleDisplay('.modal-container.small', false);
        }
    };

    const cancelDelete = () => {
        ToggleDisplay('.modal-container.small', false);
    };
    BuildModal({title: "Delete task", children: 'Are you sure you want to delete this task?', 
        confirmBut: "Delete", onConfirm: confirmDelete, cancelBut: "Cancel", onCancel: cancelDelete });
    
};

/**
 * UpdateTaskInTaskList
 * Init the input box to allow updating task
 * @param {number} item_id 
 */
async function InitUpdateBox(item_id) {
    const taskBullet = document.querySelector(`[data-id="${item_id}"]`);
    
    // Create input box for update
    const updateInput = document.createElement("input");
    updateInput.type = "text";
    updateInput.className = "task-item-input-update";
    
    // Assume focus out means the edit is finished
    updateInput.addEventListener("focusout", async (e) => {
        let description = updateInput.value;
        if (!validateTaskInput(description, "Tasklist Update Error")) return;
        const result = await editTaskDesc(item_id, description); //Sync the update in database
        if (result instanceof Error) {
            BuildModal({ title: "Tasklist Update Error", children: `${result.message}` });
            return;
        }
        const updatedEle = CreateTaskElement(description, item_id); //Create new element of tasklist
        updateInput.replaceWith(updatedEle); //Replace the input box with the updated ele
    });

    // Assume enter means the edit is finished
    updateInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            let description = updateInput.value;
            if (!validateTaskInput(description, "Tasklist Update Error")) return;
            const result = await editTaskDesc(item_id, description); //Sync the update in database
            if (result instanceof Error) {
                BuildModal({ title: "Tasklist Update Error", children: `${result.message}` });
                return;
            }
            const updatedEle = CreateTaskElement(description, item_id); //Create new element of tasklist
            updateInput.replaceWith(updatedEle);
        }
    });
    
    //Change the taskbullet to the input box
    taskBullet.replaceWith(updateInput);    
};

async function UpdateTasklistSummary() {
    const output = await getTaskSummary();
    const span = document.getElementById("tasklist-summary");
    span.textContent = output;
};

async function RenderInitialTaskList() {
    try {
        const tasklist = document.getElementById('taskBullets');
        const tasks = await getTasks();

        if (Array.isArray(tasks)) {
            tasks.forEach(task => {
                const taskBullet = CreateTaskElement(task.description, task.item_id);
                if (task.is_completed) {
                    taskBullet.classList.add('checked');
                }
                tasklist.appendChild(taskBullet);
            });
        }
    } catch (error) {
        tasklistErrorHandler("Tasklist Load Error", error.message);
    }
}


export {
    InitTaskList,
};