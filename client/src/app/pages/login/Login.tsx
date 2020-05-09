import React, {Component} from "react";
import "./login.scss";
import {CircularProgress} from "@material-ui/core";

export default class Login extends Component<any, any> {


    render() {
        return (
            <div className="login">
                <div className="content">
                    <div className="loading">
                        <CircularProgress color={"inherit"} style={{width: 20, height: 20, marginRight: 20}}/>
                        <div className="tips">正在准备...</div>
                    </div>
                </div>
            </div>
        );
    }
}

