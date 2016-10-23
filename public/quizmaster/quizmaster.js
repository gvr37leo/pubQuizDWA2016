import React from "react";

import RoomCreator from './roomCreator/roomCreator'
import TeampApprover from './teamApprover/teamApprover'
import QuestionSelector from './questionSelector/questionSelector'
import QuestionApprover from './questionApprover/questionApprover'

export default class Quizmaster extends React.Component{
    constructor(props){
        super(props)
        this.state= {}  
        this.state.subView = <RoomCreator />;
        var socket = new WebSocket("ws://localhost:8000");

        socket.onopen = function(){
            console.log("Socket connection is open!");
        }

        socket.onmessage = function(event){
            var message = event.data
            // switch(message.type){
            //     case 0:
            //         this.state.subView = <RoomCreator />
            //         break;
            //     case 1:
            //         this.state.subView = <TeampApprover />
            //         break;
            //     case 2:
            //         this.state.subView = <QuestionSelector />
            //         break;
            //     case 3:
            //         this.state.subView = <QuestionApprover />
            //         break;
            // }
        }

        socket.onclose = function(){

        }

        socket.onerror = function(){

        }
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}