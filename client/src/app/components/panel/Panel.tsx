import React, { Component } from "react";
import "./panel.scss";
import WebSocket from "../../ws/WebSocket";

export default class Panel extends Component {
	state = { date: "" };

	componentDidMount() {
		WebSocket.listen("system-time", (event: any, data: any) => {
			this.setState({ date: data });
		});
	}

	render() {
		return <div className="panel">{this.state.date}</div>;
	}
}
