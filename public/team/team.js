import React from "react";
import RoomPicker from './roomPicker/roomPicker';
import QuestionSubmitter from './questionSubmitter/questionSubmitter';

export default class Team extends React.Component{
    constructor(props){
        super(props)
        this.state = {};
        this.socket = new WebSocket("ws://localhost:8000");
        var socket = this.socket;
        this.state.subView = <RoomPicker socket={socket} loginBtnClicked={this.loginBtnClicked.bind(this)}/>
    }

    loginBtnClicked(){
        this.setState({subView:<QuestionSubmitter />});
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}
