const { app, BrowserWindow, screen, Menu, globalShortcut } = require("electron");
const path = require("path");
const child = require("child_process");

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
}

if (require("electron-squirrel-startup")) {
	console.log("electron-squirrel-startup");
	return quit(() => app.quit());
}

let server = null;
let dev = !!process.env.NODE_ENV;

function quit(callback) {
	if (!server) return callback();

	if (process.platform === "win32") {
		child.exec(`taskkill /T /F /PID ${server.pid}`, () => callback());
	} else {
		child.exec(`kill -9 ${server.pid}`, () => callback());
	}
}

function restart() {
	app.relaunch();
	app.exit();
}

function startServer() {
	if (!dev) {
		if (process.platform === "win32") {
			server = child.exec(path.join(__dirname, "/windows-server/server.exe"), err => console.log(err));
		} else {
			server = child.exec(path.join(__dirname, "/mac-server/server"), err => console.log(err));
		}
	}
}

startServer();

let mainWindow = null;

function createWindow() {
	console.log("create window");

	// Create the browser window.
	let size = screen.getPrimaryDisplay().size;
	let width = size.width * 0.8;
	let height = size.height * 0.8;

	mainWindow = new BrowserWindow({
		width: dev ? size.width * 1 : width,
		height: height,
		icon: path.join(__dirname, "redis.icns"),
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
}

if (process.platform === "darwin") {
	const template = [
		{
			label: "Application",
			submenu: [
				{
					label: "Quit",
					accelerator: "Command+Q",
					click: () => {
						quit(() => app.quit());
					}
				}
			]
		},
		{
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
				{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
			]
		},
		{
			label: "Dev",
			submenu: [{ label: "Open Dev Tools", role: "toggleDevTools" }]
		}
	];
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
} else {
	Menu.setApplicationMenu(null);
}

app.allowRendererProcessReuse = true;

function appStart() {
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on("ready", () => {
		// 注册一个 'CommandOrControl+X' 的全局快捷键
		const ret = globalShortcut.register("CommandOrControl+P", () => {
			mainWindow.webContents.openDevTools();
			console.log("CommandOrControl+P is pressed");
		});

		console.log(ret);

		// 检查快捷键是否注册成功
		console.log(globalShortcut.isRegistered("CommandOrControl+X"));

		console.log("on ready");
		console.log("main pid", process.pid);
		if (server) console.log("child pid", server.pid);

		createWindow();
	});

	// Quit when all windows are closed.
	app.on("window-all-closed", () => {
		console.log("on window-all-closed");
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		// if (process.platform !== "darwin") {}
		return quit(() => app.quit());
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

var Socket = require("./socket");
var Update = require("./update");

var ws = new Socket(app);
var update = new Update(app, ws);

ws.start(() => {
	appStart();
	app.emit("activate");
});
