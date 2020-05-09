import React, {Component} from "react";
import "./index.scss";
import Header from "../../components/header/Header";
import AddServer from "../../components/addServer/AddServer";
import KeyTree from "../../components/keyTree/KeyTree";
import Panel from "../../components/panel/Panel";
import ServerList from "../../components/serverList/ServerList";
import MProgress from "../../components/progress/Progress";
import AddKey from "../../components/addKey/AddKey";
import Connection from "../../components/connection/Connection";
import Setting from "../../components/setting/Setting";
import Modal from "../../components/modal/Modal";
import Message from "../../components/message/Message";
import {SnackbarProvider} from "notistack";
import Event from "../../event/Event";
import Loading from "../../components/loading/Loading";
import Ready from "../../components/ready/Ready";

class Index extends Component {

    state = {visible: false}

    componentDidMount() {
        Event.add("ready", (status) => this.setState({visible: status}))
    }

    componentWillUnmount() {
        Event.remove("ready")
    }

    render() {
        if (!this.state.visible) return <Ready/>
        return (
            <div className="index">
                <Loading/>
                <SnackbarProvider maxSnack={3}><Message/></SnackbarProvider>
                <Modal/>
                <AddKey/>
                <AddServer/>
                <ServerList/>
                <Setting/>
                <div className="header">
                    <Header/>
                </div>
                <div className="content">
                    <KeyTree/>
                    <Panel/>
                </div>
                <MProgress/>
                <Connection/>
            </div>
        );
    }
}

export default Index;
