import React, { Component } from "react";
import Config from "../config/Config";
import Event from "../../event/Event";

export default class Connection extends Component {
	componentDidMount() {
		this.connectDefault();
	}

	getDefaultConfig() {
		var configs = Config.getAllConfig();
		for (const key in configs) {
			let config = configs[key];
			if (config.default) {
				return config;
			}
		}
		return {};
	}

	connectDefault() {
		let config = this.getDefaultConfig();
		if (!config.name) return;
		Event.emit("connect", config.name, config.connectType);
	}

	render() {
		return null;
	}
}
