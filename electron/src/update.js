const path = require("path");
const fs = require("fs");
const axios = require("axios");

const unzip = require("unzip-stream");

class Update {
	ws = null;
	app = null;

	isCheck = false;

	currentPackage = require("../package.json");

	currentPackagePath = path.join(__dirname, "../package.json");

	currentVersion = this.currentPackage.clientVersion;

	newVersion = "";

	downUrl = this.currentPackage.downUpdateUrl;

	checkPackageUrl = `https://raw.githubusercontent.com/Lemo-yxk/redis-desktop/master/electron/package.json`;

	distZipPath = path.join(__dirname, "dist.zip");

	distPath = path.join(__dirname, "dist");

	constructor(app, ws) {
		this.ws = ws.ws;
		this.app = app;

		this.ws.AddListener("/server/update/startCheck", (e, data) => this.startCheck(e, data));
		this.ws.AddListener("/server/update/startUpdate", (e, data) => this.startUpdate(e, data));
		this.ws.AddListener("/server/system/restart", (e, data) => this.restart(e, data));
	}

	async startCheck(e, data) {
		console.log("startCheck");
		let response = await this.checkUdate();
		this.ws.Emit("/client/update/endCheck", response);
	}

	startUpdate(e, data) {
		console.log("startUpdate");
		this.update(err => {
			this.writeVersion(this.newVersion);
			this.ws.Emit("/client/update/endUpdate", { err: err });
		});
	}

	restart(e, data) {
		this.app.relaunch();
		this.app.exit();
	}

	progressUpdate(progress) {
		this.ws.Emit("/client/update/progressUpdate", { progress: progress });
	}

	deleteDir(dir) {
		var files = fs.readdirSync(dir);
		for (let i = 0; i < files.length; i++) {
			const file = path.join(dir, files[i]);
			if (fs.statSync(file).isDirectory()) {
				this.deleteDir(file);
			} else {
				fs.unlinkSync(file);
			}
		}
		fs.rmdirSync(dir);
	}

	async download(url) {
		return new Promise(async (r, j) => {
			axios({
				method: "get",
				url: url,
				responseType: "stream"
			})
				.then(response => {
					var data = response.data;
					var headers = response.headers;

					const totalLength = headers["content-length"];

					let counter = 0;

					data.on("data", bytes => {
						counter += bytes.length;
						this.progressUpdate((counter / totalLength) * 100);
					});

					data.on("end", bytes => {
						r();
					});

					data.on("error", bytes => {
						j(r);
					});

					data.pipe(fs.createWriteStream(this.distZipPath));
				})
				.catch(err => j(err));
		});
	}

	writeVersion(version) {
		this.currentPackage.clientVersion = version;
		fs.writeFileSync(this.currentPackagePath, JSON.stringify(this.currentPackage, null, 4));
	}

	async checkUdate() {
		if (this.isCheck) return { err: null, shouldUpdate: false, version: 0 };

		this.isCheck = true;
		try {
			let response = await axios({
				method: "get",
				url: this.checkPackageUrl,
				responseType: "json",
				timeout: 6000
			});
			this.newVersion = response.data.clientVersion;
			return { err: null, shouldUpdate: true, version: this.newVersion };
		} catch (err) {
			return { err: err, shouldUpdate: false, version: 0 };
		} finally {
			this.isCheck = false;
		}
	}

	update(callback) {
		this.download(this.downUrl)
			.then(() => {
				if (fs.existsSync(this.distPath)) {
					deleteDir(this.distPath);
				}
				var z = fs.createReadStream(this.distZipPath);
				z.on("end", () => callback());
				z.on("error", err => callback(err));
				z.pipe(unzip.Extract({ path: __dirname }));
			})
			.catch(err => callback(err));
	}

	mv(oldPath, newPath) {
		var res = [];
		var srcPath = oldPath;
		function get(oldPath) {
			var files = fs.readdirSync(oldPath);
			for (let i = 0; i < files.length; i++) {
				const file = path.join(oldPath, files[i]);
				if (fs.statSync(file).isDirectory()) {
					get(file);
				} else {
					res.push(file);
				}
			}
		}

		get(oldPath);

		for (let i = 0; i < res.length; i++) {
			const element = res[i];
			var distPath = path.join(newPath, element.slice(srcPath.length));
			mkdirsSync(path.dirname(distPath));
			fs.renameSync(element, distPath);
		}

		return true;
	}

	mkdirsSync(dirname) {
		if (fs.existsSync(dirname)) {
			return true;
		} else {
			if (mkdirsSync(path.dirname(dirname))) {
				fs.mkdirSync(dirname);
				return true;
			}
		}
	}
}

module.exports = Update;
