import React, { Component } from "react";
import { Drawer, Button } from "antd";
import Event from "../../event/Event";
import "./serverList.scss";
import Config from "../config/Config";

export default class ServerList extends Component {
	state = { visible: false };

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentDidMount() {
		Event.add("serverList", () => this.onOpen());
	}

	componentWillUnmount() {
		Event.remove("serverList");
	}

	createHeader() {
		let data = [];
		let config = Config.all();
		for (const key in config) {
			data.push(
				<div className="db-header" key={key}>
					<div>{key}</div>
					<div className="button">
						<Button type="link" onClick={() => Event.emit("connect", key)}>
							连接
						</Button>
						<Button type="link" onClick={() => Event.emit("update", key)}>
							修改
						</Button>
						<Button type="link" danger onClick={() => Event.emit("disconnect", key)}>
							断开
						</Button>
					</div>
				</div>
			);
		}
		return data;
	}

	render() {
		return (
			<Drawer
				title="server list"
				placement="right"
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"30%"}
				className="server-list"
			>
				{this.createHeader()}
			</Drawer>
		);
	}
}
