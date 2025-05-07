/* eslint-disable no-unused-vars */
// public/panels/mapPanel.js
import { UpdateMapImage } from "../components/map.js";
import { InitSelect } from "../components/select.js";
import { loadAllMaps, loadLocationSelectHTML } from "../services/apiServices/mapServices.js";
import { MonitorAPIServices } from "../services/monitorServices.js";
import { getLocalMap, getLocalSelectHTML } from "../utils/apiUtils.js";

const locationSelectHandler = (e) => {
    const selected_row_id = e.target.value;
    const mapObj = getLocalMap(selected_row_id);
    UpdateMapImage(mapObj); // adjust field name as needed
    document.getElementById("mapTitle").innerText = mapObj.name;
};

/**
 * InitLocationSelect
 */
function InitLocationSelect() {   
    const locationDivID = "location-select-container";
    const h1 = document.createElement("h1");
    h1.textContent = "FFXIV Map Viewer";
    const label = document.createElement("label");
    label.htmlFor = "mapSelect";
    label.textContent = "Select a map:";
    const select = document.createElement("select");
    select.name = "maps";
    select.id = "mapSelect";
    const div = document.createElement("div");
    div.id = "mapImg";
    const h2 = document.createElement("h2");
    h2.id = "mapTitle";
    const img = document.createElement("img");
    img.id = "map_img";
    img.alt = "Map Image";
    img.style.width = "1000px";
    div.appendChild(h2);
    div.appendChild(img);
    InitSelect(locationDivID, [h1, label, select, div]);
};

function TriggerFirstMap() {
    const select = document.getElementById("mapSelect");
    if (select && select.options.length > 0) {
        select.selectedIndex = 0; // Just in case it's not selected
        const event = new Event("change");
        select.dispatchEvent(event); // Trigger handler
    }
};


function PeriodicSelectUpdate(interval = 15000) {
    setInterval(() => {
        loadLocationSelectHTML();
        UpdateLocationSelect();
    }, interval);
}

function UpdateLocationSelect() {
    const html = getLocalSelectHTML();
    const select = document.getElementById("mapSelect");
    if (html !== select.innerHTML) {
        const newSelect = document.createElement('select');
        newSelect.id = "mapSelect";
        newSelect.innerHTML = html;
        newSelect.addEventListener("change", locationSelectHandler);
        select.replaceWith(newSelect);
    }
};


document.addEventListener("DOMContentLoaded", async (e) => {
    InitLocationSelect();
    await loadLocationSelectHTML(); // fetch map data
    UpdateLocationSelect();         // inject the first time
    TriggerFirstMap();
    PeriodicSelectUpdate();
    loadAllMaps();
    MonitorAPIServices();
});