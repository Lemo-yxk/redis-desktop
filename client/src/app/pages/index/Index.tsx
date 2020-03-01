import React, { Component } from "react";
import { Rnd, ResizeEnable } from "react-rnd";
import "./index.scss";
import Header from "../../components/header/Header";
import AddServer from "../../components/addServer/AddServer";
import WebSocket from "../../ws/WebSocket";

class Index extends Component {
	state = { date: "" };

	componentWillMount() {
		WebSocket.ws.addListener("system-time", (event: any, data: any) => {
			this.setState({ date: data.msg });
		});
	}

	render() {
		return (
			<div className="index">
				<AddServer></AddServer>
				<Header></Header>
				<div className="content">
					<Rnd
						default={{ height: "100%", width: "20%", x: 0, y: 0 }}
						minWidth={"20%"}
						maxWidth={"40%"}
						bounds=".content"
						enableResizing={{ right: true }}
						disableDragging={true}
						className="left"
					>
						left
					</Rnd>
					<div className="right">{this.state.date}</div>
				</div>
			</div>
		);
	}
}

export default Index;
