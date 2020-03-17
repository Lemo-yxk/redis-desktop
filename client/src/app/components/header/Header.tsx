import React, { Component } from "react";
import { Button } from "antd";
import "./header.scss";
import Event from "../../event/Event";
import { AlignLeftOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";

export default class Header extends Component {
	state = { date: "" };

	addKey = () => {
		Event.emit("addKey");
	};

	componentDidMount() {}

	render() {
		return (
			<div className="header">
				<div className="left">
					<Button type="link" ghost onClick={this.addKey}>
						<PlusOutlined />
					</Button>
				</div>
				<div className="right">
					<Button type="dashed" ghost onClick={() => Event.emit("openSetting")}>
						<SettingOutlined />
					</Button>
					<Button type="dashed" danger ghost onClick={() => Event.emit("openServerList")}>
						<AlignLeftOutlined />
					</Button>
				</div>
			</div>
		);
	}
}
