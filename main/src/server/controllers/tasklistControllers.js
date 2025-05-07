/* eslint-disable no-undef */
// src/server/controllers/tasklistControllers.js
const { getUserid } = require("../helpers/userHelpers");
const { fetchTaskItems, checkIfTasklistExist, createTasklist, 
    editItemDescription, deleteItem, editItemDueDate, 
    insertTaskItem,
    completeItem,
    countCompletedTasks,
    countAllTasks} = require("../helpers/taskHelpers");
const { passQuery } = require("../utils/queryUtils");

/**
 * getTasklistId
 * Get the tasklist id for current user
 * @param {number} user_id 
 * @returns {number} list_id
 */
async function getTasklistId(req, res) {
    const user_id = await getUserid(req);
    if (!user_id) {
        console.warn("No user is found while getting tasklist item");
        res?.status(401).json({ error: "No user is logged in yet, switch to guest services." });
        return null;
    }

    let list_id = await checkIfTasklistExist(user_id);
    if (!list_id) {
        await createTasklist(user_id);
        list_id = await checkIfTasklistExist(user_id); // retry after creation
    }
    return list_id;
}


/**
 * getAllTasks
 * Check for logined in user info, 
 * then get all task list items from the task list
 * @param {*} req
 * @param {*} res 
 * @returns {object|NULL} items
 */
async function getAllTasks(req, res) {
    const list_id = await getTasklistId(req, res);
    if (!list_id) return;
    try {
        const items = await fetchTaskItems(list_id);
        if (!items) {
            console.warn("This user doesn't have any task yet.");
            return res.status(200).json(null);
        } else {
            return res.status(200).json(items);
        }
    } catch (error) {
        console.warn("Unknown error: ", error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

/**
 * updateTaskDesc
 * Update the description for selected task
 * @param {number} item_id
 * @param {string} desc
 * @returns
 */
async function updateTaskDesc(req, res) {    
    const list_id = await getTasklistId(req, res);
    if (!list_id) return;
    try {
        const { item_id, description } = req.body;
        await editItemDescription(list_id, item_id, description);
        return res.status(200);
    } catch (error) {
        console.warn("Unknown error: ", error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

/**
 * deleteTask
 * Delete a single task
 * @param { number } item_id 
 * @returns 
 */
async function deleteTask(req, res) {
    const list_id = await getTasklistId(req, res);
    if (!list_id) return;
    try {
        const { item_id } = req.body;
        await deleteItem(list_id, item_id);
        return res.status(200);
    } catch (error) {
        console.warn("Unknown error: ", error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

/**
 * updateTaskDueDate
 * Update due date for a single task
 * @param { number } item_id 
 * @param { string } due_date 
 * @returns 
 */
async function updateTaskDueDate(req, res) {
    const list_id = await getTasklistId(req, res);
    if (!list_id) return;
    try {
        const { item_id, due_date } = req.body;
        await editItemDueDate(list_id, item_id, due_date);
        return res.status(200);
    } catch (error) {
        console.warn("Unknown error: ", error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

/**
 * addTask
 * Add a single task to the tasklist_item in db
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function addTask(req, res) {
    const list_id = await getTasklistId(req, res);
    console.log();
    if (!list_id) return;
    try { 
        const { description } = req.body;
        const item_id = await insertTaskItem({ list_id, description });
        console.log("This is the item");
        return res.status(200).json(item_id);
    } catch (error) {
        console.warn("Unknown error: ", error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

/**
 * completeTask
 * Toggle the completion status for a single task in db
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function completeTask(req, res) {
    const list_id = await getTasklistId(req, res);
    if (!list_id) return;
    try {
        const { item_id, is_completed } = req.body;
        await completeItem(list_id, item_id, is_completed);
        return res.status(200);
    } catch (error) {
        console.warn("Unknown error: ", error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

async function summarizeTaskProgress(req, res) {
    const tasklist_id = await getTasklistId(req);
    const {completed} = await countCompletedTasks(tasklist_id);
    const {total} = await countAllTasks(tasklist_id);
    return res.status(200).json(`You completed ${completed} out of ${total} tasks.`);
};
  
module.exports = {
    getTasklistId,
    getAllTasks,
    updateTaskDesc,
    deleteTask,
    updateTaskDueDate,
    addTask,
    completeTask,
    summarizeTaskProgress,
};