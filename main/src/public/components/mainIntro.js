function InitMainIntro() {
    const mainIntroDiv = document.createElement('div');
    mainIntroDiv.id = "main-intro";
    mainIntroDiv.innerHTML = `
    <h3>Welcome to the FFXIV Guide!</h3>
    <p>Here, you will find info on quests, items, and locations with maps.<br>
    Additionally, a task list for your game is available in the bottom right<br>
    corner. You can click the fold button to expand it.</p>
    <img src = "./images/logo.png" alt = "FFXIV logo" width = "500">`;
    mainIntroDiv.style.textAlign = "justify";
    document.body.appendChild(mainIntroDiv);

}

export {
    InitMainIntro
};