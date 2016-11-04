import React from "react";
import RoomPicker from './roomPicker/roomPicker';
import QuestionSubmitter from './questionSubmitter/questionSubmitter';
import WaitingRoom from './waitingRoom/waitingRoom'
var WebIO =  require('../../server/webIO');

export default class Team extends React.Component{
    constructor(props){
        super(props)
        this.state = {};
        var socket = new WebSocket("ws://localhost:8000/");
        this.webIO = new WebIO(socket);
        this.state.subView = <RoomPicker webIO={this.webIO} loginBtnClicked={this.loginBtnClicked.bind(this)}/>

        socket.onclose = (e) => {
            socket = new WebSocket("ws://localhost:8000/");
            this.webIO = new WebIO(socket);
            this.setState({subView:<RoomPicker webIO={this.webIO} loginBtnClicked={this.loginBtnClicked.bind(this)}/>});
        }

        this.webIO.on('selectQuestion', (data) => {
            this.setState({subView:<QuestionSubmitter question={data.question} webIO={this.webIO} time={data.time}/>});
        })

        this.webIO.on('questions', (data) => {
            this.setState({subView:<WaitingRoom webIO={this.webIO}/>});
        })
        
    }

    loginBtnClicked(){
        this.setState({subView:<WaitingRoom webIO={this.webIO}/>});
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}
