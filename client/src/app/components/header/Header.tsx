import React, { Component } from "react";
import "./header.scss";
import Event from "../../event/Event";
import { AddOutlined, MenuOpenOutlined, Settings } from "@material-ui/icons";
import { AppBar, Button } from "@material-ui/core";

export default class Header extends Component {
	componentDidMount() {}

	render() {
		return (
			<div className="header">
				<AppBar className="app-bar">
					<div className="left">
						<Button onClick={() => Event.emit("addKey")}>
							<AddOutlined style={{ color: "white" }} />
						</Button>
					</div>
					<div className="right">
						{/* <Button onClick={() => Event.emit("openSetting")}>
                            <Settings style={{color: "white"}}/>
                        </Button> */}
						<Button onClick={() => Event.emit("openServerList")}>
							<MenuOpenOutlined style={{ color: "white" }} />
						</Button>
					</div>
				</AppBar>
			</div>
		);
	}
}
