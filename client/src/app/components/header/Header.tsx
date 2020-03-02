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
					<Button type="primary" onClick={() => Event.emit("openAddServer")}>
						添加
					</Button>
				</div>
				<div className="right">
					<Button type="dashed" danger ghost onClick={() => Event.emit("openServerList")}>
						<AlignLeftOutlined />
					</Button>
				</div>
			</div>
		);
	}
}
