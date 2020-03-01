import React, { Component } from "react";
import { Rnd, ResizeEnable } from "react-rnd";
import "./index.scss";
import Header from "../../components/header/Header";
import AddServer from "../../components/addServer/AddServer";

class Index extends Component {
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
					<div className="right"></div>
				</div>
			</div>
		);
	}
}

export default Index;
