import React, { Component } from "react";
import { Button } from "antd";
import "./header.scss";
import Event from "../../event/Event";

export default class Header extends Component {
	render() {
		return (
			<div className="header">
				<div className="left">
					<Button type="primary" onClick={() => this.addServer()}>
						添加
					</Button>
					<Button ghost>Default</Button>
					<Button ghost>Default</Button>
					<Button ghost>Default</Button>
				</div>
				<div className="right">
					<Button type="primary" ghost>
						Primary
					</Button>
					<Button ghost>Default</Button>
					<Button type="dashed" ghost>
						link
					</Button>
					<Button type="dashed" danger ghost>
						link
					</Button>
				</div>
			</div>
		);
	}
	addServer(): void {
		Event.emit("addServer");
	}
}
