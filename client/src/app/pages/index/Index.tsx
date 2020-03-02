import React, { Component } from "react";
import "./index.scss";
import Header from "../../components/header/Header";
import AddServer from "../../components/addServer/AddServer";
import KeyTree from "../../components/keyTree/KeyTree";
import Panel from "../../components/panel/Panel";
import ServerList from "../../components/serverList/ServerList";

class Index extends Component {
	render() {
		return (
			<div className="index">
				<AddServer></AddServer>
				<ServerList></ServerList>
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
