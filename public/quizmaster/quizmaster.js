import React from "react";
import QuestionApprover from 'questionApprover/questionApprover'
import QuestionSelector from 'questionSelector/uestionSelector'
import RoomCreator from 'roomCreator/roomCreator'
import TeampApprover from 'teamApprover/teamApprover'

export default class Quizmaster extends React.Component{
    constructor(){
        super()
        var socket = new WebSocket("ws://localhost:8000");

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

    render(){
        return(
            <h1>quizmaster</h1>
        )
    }
}