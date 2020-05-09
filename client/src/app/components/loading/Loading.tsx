import React, {Component} from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Theme, withStyles} from '@material-ui/core/styles';
import Event from "../../event/Event";


const useStyles = (theme: Theme) =>
    ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    })


class Loading extends Component<any, any> {

    state = {visible: false}

    componentDidMount() {
        Event.add("loading", (status) => this.setState({visible: status}))
    }

    componentWillUnmount() {
        Event.remove("loading")
    }

    render() {
        return <Backdrop open={this.state.visible} className={this.props.classes.backdrop}>
            <CircularProgress color="inherit"/>
        </Backdrop>
    }

}

export default withStyles(useStyles)(Loading)