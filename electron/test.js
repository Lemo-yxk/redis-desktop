const axios = require("axios");
const fs = require("fs");

// async function main() {
// 	let { data, headers } = await axios({
// 		method: "get",
// 		url: "http://127.0.0.1:8080/build.zip",
// 		responseType: "stream"
// 	});

// 	const totalLength = headers["content-length"];

// 	let counter = 0;

// 	data.on("data", bytes => {
// 		counter += bytes.length;
// 		console.log(counter / totalLength);
// 	});

// 	data.pipe(fs.createWriteStream("dist.zip"));
// }

// main();

// axios.get("https://github.com/Lemo-yxk/redis-desktop/raw/master/client/package.json").then(res => console.log(res));
