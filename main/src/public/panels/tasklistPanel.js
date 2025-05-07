/* eslint-disable no-unused-vars */
import { ToggleDisplay } from "../components/displayUtil.js";
import { MonitorTasklistServices } from "../services/monitorServices.js";
function ShowTaskList() {
    ToggleDisplay('#tasklist-container', false);
};

document.addEventListener("DOMContentLoaded", (e) => {
    ShowTaskList();
    MonitorTasklistServices();
});