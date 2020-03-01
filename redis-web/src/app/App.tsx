import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory, History, UnregisterCallback, Location } from "history";
import "./App.scss";
import Index from "./pages/index/Index";
import Login from "./pages/login/Login";
import Command from "./pages/command/Command";

export default class App extends Component {
	unlisten!: UnregisterCallback;

	change(location: Location<History.PoorMansUnknown>) {
		if (false) return (window.location.hash = "/login");
		if (location.hash === "#/login") return (window.location.hash = "/index");
	}

	componentWillMount() {
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
		this.unlisten();
	}

	render() {
		return (
			<HashRouter>
				<Switch>
					<Route path="/index" component={Index} />
					<Route path="/command" component={Command} />
					<Route path="/login" component={Login} exact />
					<Redirect from="**" to="/index" />
				</Switch>
			</HashRouter>
		);
	}
}
