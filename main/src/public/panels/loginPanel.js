//public/services/loginPanel.js
import { loginValidate } from '../services/authServices.js';
import { BuildModal } from '../components/modal.js';

function InitLoginForm() {
	const mainContentDiv = document.getElementById("main-contents");
	const loginTitle = document.createElement("h2");
	loginTitle.textContent = "Login";
	loginTitle.className = "createAcc";
	const createFormDiv = document.createElement("div");
	createFormDiv.id = "create-form";
	createFormDiv.innerHTML = `
		<form action="/auth/login" id="loginForm" method="post">
            <div class="form-group">
                <label for="emailInputLog">Email address</label>
                <input type="email" class="form-control" id="emailInputLog" name="email">
            </div>
            <div class="form-group">
                <label for="passwordLog">Password</label>
                <input type="password" class="form-control" id="passLog" name="password">
            </div>
        	<button type="submit" class="loginBtn">Login</button>
        </form>
	`;
	mainContentDiv.appendChild(loginTitle);
	mainContentDiv.appendChild(createFormDiv);
};

function CreateLoginPanel() {
	const loginForm = document.getElementById("loginForm");

	//Assign event listener for the register form
	loginForm.addEventListener("submit", (e) => {
	  e.preventDefault(); 
	  
	  //Grabbing all the values from the form
	  const email = document.getElementById("emailInputLog").value;
	  const password = document.getElementById("passLog").value;
	  const result = loginValidate(email, password);
	  if (result instanceof Error) {
		BuildModal({ title: "Login Error", children: `${result.message}` });
	  } else {
		BuildModal({ title: "Successful Login!", children: "You successfully logged in!" });
	  }   
	});
};

document.addEventListener("DOMContentLoaded", (e) => {
	InitLoginForm();
	CreateLoginPanel();
});
