import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory, History, UnregisterCallback, Location } from "history";
import "./App.scss";
import Index from "./pages/index/Index";
import Login from "./pages/login/Login";
import WebSocket from "./ws/WebSocket";

export default class App extends Component {
	unlisten!: UnregisterCallback;

	change(location: Location<History.PoorMansUnknown>) {
		if (!localStorage.getItem("status")) return (window.location.hash = "/login");
		if (location.hash === "#/login") return (window.location.hash = "/index");
	}

	constructor(props: any) {
		super(props);
		WebSocket.start();
	}

	componentDidMount() {
		const history = createBrowserHistory();
		// Get the current location.
		const location = history.location;

		this.change(location);

		// Listen for changes to the current location.
		this.unlisten = history.listen((location, action) => {
			// location is an object like window.location
			this.change(location);
		});
	}

	componentWillUnmount() {
		WebSocket.close();
		this.unlisten();
	}

	render() {
		return (
			<HashRouter>
				<Switch>
					<Route path="/index" component={Index} />
					<Route path="/login" component={Login} exact />
					<Redirect from="**" to="/index" />
				</Switch>
			</HashRouter>
		);
	}
}
