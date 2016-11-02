import React from "react";
import RoomStatus from './roomStatus/room';
import RoomPicker from './roomPicker/roomPicker'
var WebIO =  require('../../server/webIO');

export default class Scoreboard extends React.Component{
    constructor(){
        super()
        var socket = new WebSocket("ws://localhost:8000");
        this.webIO = new WebIO(socket);
        this.state = {subView:<RoomPicker loginBtnClicked={this.loginBtnClicked.bind(this)} webIO={this.webIO} />};
        
        this.webIO.on('answer', (data) => {
            this.setState({subView:<RoomStatus room={data.room} />})
        })

        this.webIO.on('roundEnd', (data) => {
            this.setState({subView:<RoomStatus room={data.room} />})
        })
    }

    loginBtnClicked(){
        this.setState({subView:<RoomStatus />});
    }

    render(){
        return(
            <div>
                {this.state.subView}
            </div>
        )
    }
}