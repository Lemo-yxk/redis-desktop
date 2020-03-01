const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");
const child = require("child_process");

function main() {
	// env
	let dev = !!process.env.NODE_ENV;

	// Handle creating/removing shortcuts on Windows when installing/uninstalling.
	if (require("electron-squirrel-startup")) {
		console.log("on electron-squirrel-startup");
		// eslint-disable-line global-require
		app.quit();
	}

	let server = null;

	if (!dev) {
		if (process.platform === "win32") {
			server = child.exec(path.join(__dirname, "server.exe"));
		} else {
			server = child.exec(path.join(__dirname, "server"));
		}
	}

	const createWindow = () => {
		console.log("create window");

		// Create the browser window.
		let size = screen.getPrimaryDisplay().workAreaSize;
		let width = size.width * 0.6;
		let height = size.height * 0.8;

		const mainWindow = new BrowserWindow({
			width: dev ? size.width * 1 : width,
			height: height,
			webPreferences: {
				nodeIntegration: true
			}
		});

		// and load the index.html of the app.
		if (dev) {
			mainWindow.loadURL("http://127.0.0.1:3000");
		} else {
			mainWindow.loadFile(path.join(__dirname, "/dist/index.html"));
		}

		// Open the DevTools.
		if (dev) mainWindow.webContents.openDevTools();
	};

	Menu.setApplicationMenu(null);

	app.allowRendererProcessReuse = true;

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on("ready", () => {
		console.log("on ready");
		console.log("main pid", process.pid);
		if (server) {
			console.log("child pid", server.pid);
		}
		createWindow();
	});

	// Quit when all windows are closed.
	app.on("window-all-closed", () => {
		console.log("on window-all-closed");
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		// if (process.platform !== "darwin") {}

		if (!server) return app.quit();

		if (process.platform === "win32") {
			child.exec(`taskkill /T /F /PID ${server.pid}`, () => app.quit());
		} else {
			child.exec(`kill -9 ${server.pid}`, () => app.quit());
		}
	});

	app.on("activate", () => {
		console.log("on activate");
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	// In this file you can include the rest of your app's specific main process
	// code. You can also put them in separate files and import them here.
}

main();
