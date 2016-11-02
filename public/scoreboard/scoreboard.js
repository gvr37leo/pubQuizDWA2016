import React from "react";

import Login from './login/login'

var WebIO = require('../../server/webIO');

export default class Scoreboard extends React.Component{
    constructor(){
        super()
        var socket = new WebSocket("ws://localhost:8000/");
        this.webIO = new WebIO(socket);
        this.state = {
          subView: "Login"
        };
				this.setupIOHandlers();
    }

		setupIOHandlers(){
			this.webIO.socket.onclose = () => {
				this.setView("Login");
			};
			this.webIO.on('notaroom', (data) => {
				console.log('Not a room, wait');
				this.setState({message: "Room does not exist"});
			});
			this.webIO.on('joinsucces', (data) => {
				this.setState({message: "Join succesful"});
				this.setView("Normal");
			});
		}

		setView(newView){
			this.setState({subView: newView});
		}

    render(){
      let subItem = <h2>Test</h2>
			let viewChange = this.setView.bind(this);
      switch(this.state.subView){
        case "Login":{
          subItem = <Login webIO={this.webIO} setView={viewChange} message={this.state.message}/>
          break;
        }
      }
        return(
            <div>{subItem}</div>
        )
    }
}