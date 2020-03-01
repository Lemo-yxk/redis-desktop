import React, { Component } from "react";
import { Rnd } from "react-rnd";
import "./keyTree.scss";

export default class KeyTree extends Component {
	render() {
		return (
			<Rnd
				default={{ height: "100%", width: "20%", x: 0, y: 0 }}
				minWidth={"20%"}
				maxWidth={"40%"}
				bounds=".content"
				enableResizing={{ right: true }}
				disableDragging={true}
				className="key-tree"
			>
				key-tree
			</Rnd>
		);
	}
}
