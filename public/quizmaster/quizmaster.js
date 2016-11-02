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
        this.state= {};
        var socket = new WebSocket("ws://localhost:8000");
        this.webIO = new WebIO(socket)

        this.state.subView = <RoomCreator webIO={this.webIO}/>

        this.webIO.on('endRound', () => {
            this.setState({subView:<ContNext stopBtnClicked={this.stopBtnClicked.bind(this)} webIO={this.webIO} />})
        })

        this.webIO.on('questions', (data) => {
            this.setState({subView: <QuestionSelector 
                questions={data.questions} 
                webIO={this.webIO}/>
            })
        })

        this.webIO.on('selectQuestion', (data) =>{
            this.setState({subView: <QuestionApprover
                webIO={this.webIO}
                question={data.question}
                />
            })
        })

        this.webIO.on('roomUpdate', (data) => {
            this.setState({subView: <TeampApprover
                webIO={this.webIO}
                id={data.room.id}
                password={data.room.password}
                teams={data.room.teams}
                />
            })
        })

        socket.onerror = function(){

        }
    }

    stopBtnClicked = function(){
        this.setState({subView: <RoomCreator webIO={this.webIO}/>})
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}
