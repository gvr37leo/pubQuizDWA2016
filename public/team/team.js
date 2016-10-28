import React from "react";
import RoomPicker from './roomPicker/roomPicker';
import QuestionSubmitter from './questionSubmitter/questionSubmitter';
var WebIO =  require('../../server/webIO');

export default class Team extends React.Component{
    constructor(props){
        super(props)
        this.state = {};
        var socket = new WebSocket("ws://localhost:8000");
        this.webIO = new WebIO(socket);
        this.state.subView = <RoomPicker webIO={this.webIO} loginBtnClicked={this.loginBtnClicked.bind(this)}/>
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
