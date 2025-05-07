/* eslint-disable no-unused-vars */
import { checkUser } from "../services/userServices.js";
import { ToggleDisplay } from "../components/displayUtil.js"; 
import { createGuest  } from "../services/guestServices.js";
import { MonitorUserServices } from "../services/monitorServices.js";

async function ActivateAuthSection() {
	const username = await checkUser();
	console.log("Find the user: ", username);
	if (!username) {
		createGuest();
	} else {
		UpdateUserProfile(username);
	}
	ToggleDisplay((username) ? '#auth-section' : '#user-dropdown', true);
	ToggleDisplay((username) ? '#user-dropdown' : "#auth-section", false);
};

function UpdateUserProfile(username) {
	const usernameSpan = document.querySelector('.user-dropdown-name-span');
	usernameSpan.textContent = username;
};

document.addEventListener("DOMContentLoaded", async (e) => {
	await ActivateAuthSection();
	MonitorUserServices();
});


