import React from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import "./index.css";
import App from "./app/App";
import * as serviceWorker from "./serviceWorker";
import Config from "./app/components/config/Config";

Axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

Axios.defaults.baseURL = "http://127.0.0.1:12388";

Axios.defaults.timeout = 5000;

Axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return error;
    }
);


Config.delDB();
Config.delServerName();

ReactDOM.render(<App/>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
