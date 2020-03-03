import React, { Component } from "react";
import "./panel.scss";
import WebSocket from "../../ws/WebSocket";
import Event from "../../event/Event";
import Transform from "../../transform/Transform";
import String from "./data/String";
import List from "./data/List";

export default class Panel extends Component {
	state = { component: "" };

	componentDidMount() {
		Event.add("selectKey", (serverName: string, type: string, key: string) => {
			let component = null;

			switch (type) {
				case "string":
					component = <String></String>;
					break;
				case "list":
					component = <List></List>;
					break;
				case "hash":
					break;
				case "zset":
					break;
				case "set":
					break;
			}

			this.setState({ component: component }, () => {
				Event.emit(type, serverName, type, key);
			});
		});
	}

	componentWillUnmount() {
		Event.remove("selectKey");
	}

	render() {
		return <div className="panel">{this.state.component}</div>;
	}
}
