import api from './config/apiConfig.js';


async function MonitorRoute(routeName) {
    await api.get(`/${routeName}/health`);
};

function MonitorAuthServices() {
	setInterval(async () => {
		await MonitorRoute("auth");
	  }, 5000);
};

function MonitorTasklistServices() {
    setInterval(async () => {
		await MonitorRoute("tasklist");
	  }, 5000);
};

function MonitorUserServices() {
    setInterval(async () => {
		await MonitorRoute("user");
	  }, 5000);
};

function MonitorAPIServices() {
    setInterval(async () => {
		await MonitorRoute("api");
	}, 5000);
}

export {
    MonitorAuthServices,
    MonitorTasklistServices,
    MonitorUserServices,
    MonitorAPIServices,
}