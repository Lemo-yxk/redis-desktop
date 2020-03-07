import React from "react";
import "./login.scss";
import { LoadingOutlined } from "@ant-design/icons";

function Login() {
	return (
		<div className="login">
			<div className="content">
				<div className="loading">
					<LoadingOutlined style={{ fontSize: "2rem" }}></LoadingOutlined>
					<div className="tips">正在准备...</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
