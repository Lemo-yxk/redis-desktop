import React, {Component} from "react";
import "./progress.scss";
import Event from "../../event/Event";
import {LinearProgress} from "@material-ui/core";

export default class MProgress extends Component {
    componentWillUnmount() {
        Event.remove("progress");
    }

    componentDidMount() {
        Event.add("progress", (v) => this.progress(v));
    }

    progress(v: number) {
        if (v === 0) {
            setTimeout(() => {
                this.setState({progress: v});
            }, 1000);
        } else {
            this.setState({progress: v});
        }
    }

    state = {progress: 0};

    render() {
        return (
            <LinearProgress variant="determinate" value={100} style={{width: `${this.state.progress}%`, height: "2px"}}/>
        );
    }
}
