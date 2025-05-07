function InitNav() {
    const navDiv = document.createElement('div');
    navDiv.id = "nav";
    navDiv.innerHTML = `
        <li><a href = "/">Tasks</a></li>
		<li><a href = "/api/quests">Quests</a></li>
		<li><a href = "/api/items">Items</a></li>
		<li><a href = "/api/locations">Map Locations</a></li>
    `;
    document.body.appendChild(navDiv);
};

export {
    InitNav
};