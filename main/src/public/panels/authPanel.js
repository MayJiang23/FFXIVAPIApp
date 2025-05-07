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
		ToggleDisplay('#auth-section', true);
		ToggleDisplay('#user-dropdown', false);
	} else {
		UpdateUserProfile(username);
		ToggleDisplay('#user-dropdown', true);
		ToggleDisplay('#auth-section', false);
	}
};

function UpdateUserProfile(username) {
	const usernameSpan = document.querySelector('.user-dropdown-name-span');
	usernameSpan.textContent = username;
};

document.addEventListener("DOMContentLoaded", async (e) => {
	await ActivateAuthSection();
	MonitorUserServices();
});


