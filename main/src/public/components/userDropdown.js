// public/components/userDropdown.js
import { ToggleDisplay } from "./displayUtil.js"; 

function BuildUserDropdown() {
    const userDropdownDiv = document.getElementById('user-dropdown');
    const iconImage = document.createElement("img");
    iconImage.id = 'user-dropdown-icon';
    iconImage.alt = "User Icon Image";
    userDropdownDiv.appendChild(iconImage);

    const usernameDiv = document.createElement("div");
    usernameDiv.id = "user-dropdown-name-div";
    const userName = document.createElement("span");
    userName.className = 'user-dropdown-name-span';
    userDropdownDiv.appendChild(userName);

    const dropdownContent = document.createElement("div");
    dropdownContent.id = 'user-dropdown-content';
    dropdownContent.className = 'hide';
    userDropdownDiv.appendChild(dropdownContent);
    BuildUserDropdownContent();
    userDropdownDiv.addEventListener("mouseover", () => {
        if (userDropdownDiv.classList.contains("show")) {
			ToggleDisplay('#user-dropdown-content', true);
		}
    });
    userDropdownDiv.addEventListener("mouseleave", () => {
        ToggleDisplay('#user-dropdown-content', false);
    });
};



function BuildUserDropdownContent() {
    const dropdownContent = document.getElementById('user-dropdown-content');
    const dropdownProfileDiv = document.createElement('div');
    const dropdownProfileSpan = document.createElement('span');
    dropdownProfileSpan.textContent = "Profile";
    dropdownProfileDiv.appendChild(dropdownProfileSpan);
    dropdownProfileDiv.onclick = () => {
        location.href = "/profile";
    };
    dropdownContent.appendChild(dropdownProfileDiv);
    
    const dropdownTasklistDiv = document.createElement("div");
    const dropdownTasklistSpan = document.createElement("div");
    dropdownTasklistSpan.textContent = "Tasklist";
    dropdownTasklistDiv.appendChild(dropdownTasklistSpan);
    dropdownTasklistDiv.onclick = () => {
        location.href = '/tasklist';
    };
    dropdownContent.appendChild(dropdownTasklistDiv);
};

export {
    BuildUserDropdown
};