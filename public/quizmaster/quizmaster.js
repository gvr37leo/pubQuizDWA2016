import React from "react";

import RoomCreator from './roomCreator/roomCreator'
import TeampApprover from './teamApprover/teamApprover'
import QuestionSelector from './questionSelector/questionSelector'
import QuestionApprover from './questionApprover/questionApprover'

export default class Quizmaster extends React.Component{
    constructor(props){
        super(props)
        this.state= {}
        // <QuestionSelector />
        // <QuestionApprover />;
        // <TeampApprover />
        this.socket = new WebSocket("ws://localhost:8000");
        var socket = this.socket;
        this.state.subView = <RoomCreator socket={socket} handleStartRoomClick={this.handleStartRoomClick.bind(this)}/>


        socket.onopen = function(){
            console.log("Socket connection is open!");
        }

        socket.onmessage = function(event){
            var message = event.data
        }

        socket.onclose = function(){

        }

        socket.onerror = function(){

        }
    }

    handleStartRoomClick = function(){
        this.setState({subView: <TeampApprover handleStartQuizClick={this.handleStartQuizClick.bind(this)} socket={this.socket}/>})
    }

    handleStartQuizClick = function(){
        this.setState({subView: <QuestionSelector socket={this.socket}/>})
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}
