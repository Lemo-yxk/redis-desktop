import React, { Component } from "react";
import { Drawer } from "antd";
import Event from "../../event/Event";

export default class AddServer extends Component {
	state = { visible: false };
	event!: string;

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentWillMount() {
		this.event = Event.add("addServer", () => {
			this.onOpen();
		});
	}

	componentWillUnmount() {
		Event.remove(this.event);
	}

	render() {
		return (
			<Drawer
				title="Basic Drawer"
				placement="right"
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"50%"}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Drawer>
		);
	}
}
