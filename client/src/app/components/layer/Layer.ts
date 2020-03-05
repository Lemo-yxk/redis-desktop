class Layer {
	mask: any;

	constructor() {
		let div = document.createElement("div");
		div.style.display = "flex";
		div.style.justifyContent = "center";
		div.style.alignItems = "center";
		div.style.width = "100vw";
		div.style.height = "100vh";
		div.style.position = "absolute";
		div.style.top = "0";
		div.style.left = "0";
		div.style.display = "none";
		this.mask = div;

		let child = document.createElement("div");
		child.className = "load-mask-child";

		div.appendChild(child);
		document.body.appendChild(div);
	}

	load() {
		this.mask.style.display = "flex";
	}

	close() {
		this.mask.style.display = "none";
	}
}

export default new Layer();
