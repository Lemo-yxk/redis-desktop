import React, { Component } from "react";
import { Button } from "antd";
import "./header.scss";
import Event from "../../event/Event";
import { AlignLeftOutlined } from "@ant-design/icons";

export default class Header extends Component {
	render() {
		return (
			<div className="header">
				<div className="left">
					<Button type="primary" onClick={() => this.addServer()}>
						添加
					</Button>
				</div>
				<div className="right">
					<Button type="dashed" danger ghost onClick={() => this.serverList()}>
						<AlignLeftOutlined />
					</Button>
				</div>
			</div>
		);
	}
	serverList(): void {
		Event.emit("serverList");
	}
	addServer(): void {
		Event.emit("addServer");
	}
}
