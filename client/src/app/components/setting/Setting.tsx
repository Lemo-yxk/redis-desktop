import React, {Component} from "react";
import Event from "../../event/Event";
import "./setting.scss";
import WebSocket from "../../ws/WebSocket";
import {Button, Drawer, Tab, Tabs} from "@material-ui/core";
import {createStyles, withStyles} from '@material-ui/styles'
// import { Terminal } from "xterm";
// import "../../../../node_modules/xterm/css/xterm.css";
// const os = window.require("electron").remote.require("os");
// const process = window.require("electron").remote.require("process");
// const pty = window.require("electron").remote.require("node-pty");
const styleSheet = createStyles({
    paper: {
        height: '80%'
    }
})


class Setting extends Component<any, any> {
    state = {visible: false, loading: false, progress: 0, index: 0};

    onClose() {
        this.setState({visible: false});
    }

    onOpen() {
        this.setState({visible: true});
    }

    componentDidMount() {
        Event.add("openSetting", () => this.onOpen());
    }

    componentWillUnmount() {
        Event.remove("openSetting");
    }

    restart() {
        WebSocket.ws.Emit("/Electron/System/restart");
    }

    command() {
        WebSocket.ws.Emit("/Electron/System/command", `console.log(this.app)`);
    }

    render() {

        const classes = this.props.classes

        return (
            <Drawer
                anchor={"top"}
                open={this.state.visible}
                onClose={() => this.onClose()}
                classes={{paper: classes.paper}}
            >
                <div className="setting">
                    <Tabs
                        value={this.state.index}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        onChange={(e, value) => this.setState({index: value})}
                    >
                        <Tab label="基本设置" key={0} value={0} {...a11yProps(0)} />
                        <Tab label="高级设置" key={1} value={1} {...a11yProps(1)} />
                    </Tabs>

                    <TabPanel value={this.state.index} index={0}>
                        <div className="setting-form">
                            {/*<Button variant="contained" onClick={() => this.restart()}>*/}
                            {/*    重启*/}
                            {/*</Button>*/}

                            {/*<Button variant="contained" onClick={() => this.command()}>*/}
                            {/*    命令*/}
                            {/*</Button>*/}
                        </div>
                        <div className="button-box">
                            <Button variant="contained">保存</Button>
                        </div>
                    </TabPanel>

                </div>

            </Drawer>
        );
    }
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

export default withStyles(styleSheet)(Setting)