import React from "react";

import RoomCreator from './roomCreator/roomCreator'
import TeampApprover from './teamApprover/teamApprover'
import QuestionSelector from './questionSelector/questionSelector'
import QuestionApprover from './questionApprover/questionApprover'
import ContNext from './contNext/contNext'

var WebIO =  require('../../server/webIO');

export default class Quizmaster extends React.Component{
    constructor(props){
        super(props)
        this.state= {}
        // <QuestionSelector />
        // <QuestionApprover />;
        // <TeampApprover />
        var socket = new WebSocket("ws://localhost:8000/");

        this.webIO = new WebIO(socket)
        this.state.subView = <RoomCreator webIO={this.webIO} handleStartRoomClick={this.handleStartRoomClick.bind(this)}/>

        this.webIO.on('endRound', () => {
            this.setState({subView:<ContNext  webIO={this.webIO} />})
        })

        socket.onerror = function(){

        }
    }

    handleStartRoomClick = function(){
        this.setState({subView: <TeampApprover handleStartQuizClick={this.handleStartQuizClick.bind(this)} webIO={this.webIO}/>})
    }

    handleStartQuizClick = function(){
        this.setState({subView: <QuestionSelector btnQuestionClicked={this.btnQuestionClicked.bind(this)} webIO={this.webIO}/>})
    }

    btnQuestionClicked = function(){
        this.setState({subView: <QuestionApprover btnNextQuestionClicked={this.btnNextQuestionClicked.bind(this)} webIO={this.webIO}/>})
    }

    btnNextQuestionClicked = function(){
        this.handleStartQuizClick();
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}
