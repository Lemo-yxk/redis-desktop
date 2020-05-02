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

class Index extends Component {
    render() {
        return (
            <div className="index">
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
