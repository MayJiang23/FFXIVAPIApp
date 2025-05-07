/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { passQuery } = require("../utils/queryUtils");
const { formatTimestamp } = require("./timestamHelpers");

/**
 * checkIfTasklistExist
 * Check if tasklist exists in the DB using user_id.
 * If exists, return list_id, else return false
 * 
 * @param {number} user_id 
 * @returns {boolean|number} 
 */
async function checkIfTasklistExist(user_id) {
    try {
        const result = 
            await passQuery("SELECT * FROM tasklist WHERE user_id = ?", 
            [user_id]);
        if (result.length === 0) {
            return false;
        }
        return result[0].list_id;
    } catch (error) {
        console.warn(error);
        return false;
    }
};

/**
 * findTasks
 * 
 * @param {number} list_id 
 * @param {string} description 
 * @returns {number|null} 
 */
async function findTasks(list_id, description) {
    try {
        const result = 
        await passQuery(`SELECT * FROM tasklist_item WHERE description = ?
            AND tasklist_id = ?`, [description, list_id]);
            console.log(result);
            return (result.length === 0) ? null : result;

    } catch (error) {
        return null;
    }
}

/**
 * createTasklist
 * Create a new task list for the user
 * @param {number} user_id 
 * @returns 
 */
async function createTasklist(user_id) {
    try {
        const now = new Date();
        const formated = formatTimestamp(now);
        await passQuery("INSERT INTO tasklist (user_id, created_at) VALUES (?, ?)", 
            [user_id, formatted]);
    } catch (error) {
        console.warn(error);
        return;
    }
};

/**
 * insertTaskItem
 * Insert a single task item into the DB
 * @param {object} input: {list_id, description, is_completed, due_date}  
 * @return {number}
 */
async function insertTaskItem({ list_id, description, is_completed = false, due_date = null }) {
    try {
        const now = new Date();
        const created_at = formatTimestamp(now);
        await passQuery(`INSERT INTO tasklist_item (tasklist_id, description, 
            is_completed, due_date, created_at) VALUES (?, ?, ?, ?, ?)`, 
            [list_id, description, is_completed, due_date, created_at]);
        const result = await passQuery(`SELECT * FROM tasklist_item WHERE description = ?
            AND tasklist_id = ? AND created_at = ?`, [description, list_id, created_at]);
        if (result) {
            return result[0].item_id;
        } else {
            return null;
        }
    } catch (error) {
        console.warn(error);
        return null;
    }
};

/**
 * fetchTaskItem
 * Fetch all task items in a single list
 * @param {number} list_id 
 * @returns {object[]|NULL}
 */
async function fetchTaskItems(list_id) {
    try {
        const items = await passQuery('SELECT * FROM tasklist_item WHERE tasklist_id = ?',
            [list_id]);
        return items;
    } catch (error) {
        console.warn(error);
        return null;
    }
};

async function deleteItem(list_id, item_id) {
    try {
       await passQuery('DELETE FROM tasklist_item WHERE item_id = ? AND tasklist_id = ?', [item_id, list_id]);
    } catch (error) {
        console.warn(error);
        return null;
    }
};

async function editItemDescription(list_id, item_id, description) {
    try {
        await passQuery('UPDATE tasklist_item SET description = ? WHERE item_id = ? AND tasklist_id = ?', 
            [description, item_id, list_id]);
    } catch (error) {
        console.warn(error);
        return null;
    }
};

async function editItemDueDate(list_id, item_id, due_date) {
    try {
        await passQuery('UPDATE tasklist_item SET due_date = ? WHERE item_id = ? AND tasklist_id = ?',
            [due_date, item_id, list_id]);
    } catch (error) {
        console.warn(error);
        return null;
    }
};

async function completeItem(list_id, item_id, is_completed) {
    try {
        await passQuery("UPDATE tasklist_item SET is_completed = ? WHERE item_id = ? AND tasklist_id = ?", 
            [is_completed, item_id, list_id]);
    } catch (error) {
        console.warn(error);
        return null;
    }
};

module.exports = {
    insertTaskItem,
    checkIfTasklistExist,
    fetchTaskItems,
    deleteItem,
    editItemDescription,
    editItemDueDate,
    completeItem,
    createTasklist,
};
