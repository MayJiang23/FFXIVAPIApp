/* eslint-disable no-unused-vars */
//public/services/registerPanel.js
import { registerUser } from '../services/authServices.js';
import { BuildModal } from '../components/modal.js';
import { MonitorAuthServices } from '../services/monitorServices.js';

function InitRegisterForm() {
	const mainContentDiv = document.getElementById("main-contents");
	const formTitle = document.createElement("h2");
	formTitle.textContent = "Create Account";
	formTitle.className = "createAcc";
	const formDiv = document.createElement("div");
	formDiv.id = "create-form";
	formDiv.innerHTML = `
		 <form action="/auth/create" id="register-form" method="post">
			<p>Already have an account? <a href="/auth/login">Sign in.</a></p>
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" id="email" name="email" placeholder="user123@gmail.com..."/>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password" minlength="8" maxlength="15"/>
            </div>
			<div class="form-group">
				<label for="username">User Name</label>
				<input type="text" class="form-control" id="username" name="username" placeholder="User Name"/>
			</div>
            <button type="submit" class="submitBtn">Register Account</button>
        </form>
	`;
	mainContentDiv.appendChild(formTitle);
	mainContentDiv.appendChild(formDiv);
};

function CreateRegisterPanel() {
	const registerForm = document.getElementById("register-form");

	//Assign event listener for the register form
	registerForm.addEventListener("submit", async (e) => {
	  e.preventDefault(); 
	  //Grabbing all the values from the form
	  const username = document.getElementById("username").value;
	  const password = document.getElementById("password").value;
	  const email = document.getElementById("email").value;
	  const newUser = { username, password, email };
	  const result = await registerUser(newUser);
	  if (result instanceof Error) {
		BuildModal({ title: "Register Error", children: `${result.message}` });
	  } else {
		BuildModal({ title: "Successful Register!", children: "You successfully registerd!" });
	  } 
	});
};

document.addEventListener("DOMContentLoaded", (e) => {
	InitRegisterForm();
	CreateRegisterPanel();
	MonitorAuthServices();
});
