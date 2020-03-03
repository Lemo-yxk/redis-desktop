import React, { Component } from "react";
import { Button } from "antd";
import "./header.scss";
import Event from "../../event/Event";
import { AlignLeftOutlined } from "@ant-design/icons";
import WebSocket from "../../ws/WebSocket";

export default class Header extends Component {
	state = { date: "" };

	componentDidMount() {
		WebSocket.listen("system-time", (event: any, data: any) => {
			this.setState({ date: data });
		});
	}

	render() {
		return (
			<div className="header">
				<div className="left">
					<Button type="primary" onClick={() => Event.emit("openAddServer")}>
						添加
					</Button>
				</div>
				<div className="right">
					<Button type="link" danger>
						{this.state.date}
					</Button>
					<Button type="dashed" danger ghost onClick={() => Event.emit("openServerList")}>
						<AlignLeftOutlined />
					</Button>
				</div>
			</div>
		);
	}
}
