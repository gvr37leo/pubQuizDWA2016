import React from "react";
import RoomStatus from './roomStatus/roomStatus';
import RoomPicker from './roomPicker/roomPicker'
var WebIO =  require('../../server/webIO');

export default class Scoreboard extends React.Component{
    constructor(){
        super()
        var socket = new WebSocket("ws://localhost:8000/");
        this.webIO = new WebIO(socket);
        this.state = {subView:<RoomPicker webIO={this.webIO} />};
        
        this.webIO.on('roomChanged', (data) => {
            this.setState({subView:<RoomStatus showAnswers={false} room={data.room} />})
        })
        this.webIO.on('questions', (data) => {
            this.setState({subView:<RoomStatus showAnswers={true} room={data.room}/>});
        })
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}