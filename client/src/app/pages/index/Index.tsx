import React, { Component } from "react";
import "./index.scss";
import Header from "../../components/header/Header";
import AddServer from "../../components/addServer/AddServer";
import KeyTree from "../../components/keyTree/KeyTree";
import Panel from "../../components/panel/Panel";
import ServerList from "../../components/serverList/ServerList";
import MProgress from "../../components/progress/Progress";
import AddKey from "../../components/addKey/AddKey";
import Connection from "../../components/connection/Connection";
import Setting from "../../components/setting/Setting";

class Index extends Component {
	render() {
		return (
			<div className="index">
				<AddKey></AddKey>
				<AddServer></AddServer>
				<ServerList></ServerList>
				<Setting></Setting>
				<div className="header">
					<Header></Header>
				</div>
				<div className="content">
					<KeyTree></KeyTree>
					<Panel></Panel>
				</div>
				<MProgress></MProgress>
				<Connection></Connection>
			</div>
		);
	}
}

export default Index;
