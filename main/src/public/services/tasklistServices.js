import api from './config/apiConfig.js';
import { addLocalTask, 
    deleteLocalTask, 
    getLocalTasks, 
    toggleLocalTask, 
    updateLocalTask, 
    sortItems } from '../utils/tasklistUtils.js';
import { isGuestService } from './guestServices.js';

/**
 * createTask
 * Create a task and insert it into the db
 * @param {string} description 
 * @returns {number} item_id or error
 */
async function createTask(description) {
    try {
        const response = await api.post('/tasklist/add', { description });              
        if (response.data) {
            return response.data;
        } 
    } catch (error) {
        if (isGuestService(error)) {
            const { id } = addLocalTask(description);
            return id;  
        }
        throw new Error(`Creating task error occured! ${error}`, { cause: error });
    }   
};

/** 
 * deleteTask
 * Delete a single task and update in the db
 * @param {number} item_id
 * @returns error or nothing
 */
async function deleteTask(item_id) {
    try {
        await api.delete('/tasklist/delete', { data: { item_id } });
    } catch (error) {
        if (isGuestService(error)) {
            deleteLocalTask(item_id);            
            return;
        }
        throw new Error(`Deleting task error occured! ${error}`, { cause: error });
    }
};

/**
 * checkTask
 * Check a task and update it in the db 
 * @param {number} item_id
 * @param {number} is_completed
 * @returns error or nothing
 */
async function checkTask(item_id, is_completed) {
    try {
        await api.patch('/tasklist/complete', { item_id, is_completed });
    } catch (error) {
        if (isGuestService(error)) {
            toggleLocalTask(item_id);            
            return;
        }
        throw new Error(`Checking task error occured! ${error}`, { cause: error });
    }
    
};

/**
 * editTaskDesc
 * Edit a task's description and update it in the db
 * @param {number} item_id
 * @param {string} description
 * @returns error or nothing
 */
async function editTaskDesc(item_id, description) {
    try {
        await api.patch('/tasklist/updatedesc', { item_id, description });
    } catch (error) {
        if (isGuestService(error)) {
            updateLocalTask(item_id, description);
            return;
        }
        throw new Error(`Editing task desc error occured! ${error}`, { cause: error });
    }
};


/**
 * getTasks
 * Get all the tasks in current user's tasklist
 * @returns error or items
 */
async function getTasks() {
    try {
        const response = await api.get('/tasklist/items');
        if (response.data) {
            const items = sortItems(response.data);
            return items || [];
        } else {
            return [];
        }
    } catch (error) {
        if (isGuestService(error)) {
            const items = getLocalTasks();
            return items || [];
        }
        throw new Error(`Getting all tasks error occured! ${error.message}`, { cause: error });
    }
};

async function getTaskSummary() {
    try {
        const response = await api.get('/tasklist/summary');
        if (response.data) {
            return response.data || "No task yet.";
        } else {
            return "No task yet.";
        }
    } catch (error) {
        console.warn(`Getting task summary error occured! ${error.message}`, { cause: error });
        return "No task yet.";
    }
}

export {
    createTask,
    deleteTask,
    checkTask,
    editTaskDesc,
    getTasks,
    getTaskSummary,  
};