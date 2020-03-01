import React, { Component } from "react";
import "./index.scss";
import Header from "../../components/header/Header";
import AddServer from "../../components/addServer/AddServer";
import WebSocket from "../../ws/WebSocket";
import KeyTree from "../../components/keyTree/KeyTree";
import Panel from "../../components/panel/Panel";

class Index extends Component {
	render() {
		return (
			<div className="index">
				<AddServer></AddServer>
				<Header></Header>
				<div className="content">
					<KeyTree></KeyTree>
					<Panel></Panel>
				</div>
			</div>
		);
	}
}

export default Index;
