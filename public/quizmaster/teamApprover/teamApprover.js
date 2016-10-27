import React from 'react';
import TeamPanel from './teamPanel/teamPanel';

export default class TeamApprover extends React.Component{
    constructor(props){
        super(props)

        this.state = {};
        this.state.teams = []
        this.props.socket.onmessage = (event) => {
            // roomUpdate needs to be switch cased or webiod
            var data = JSON.parse(event.data);

            this.setState({
                id:data.room.id,
                password:data.room.password,
                teams:data.room.teams
            });
        }
    }

    goBtnClicked(){
        this.props.handleStartQuizClick()
    }

    render(){
        var teamElements = [];
        for(var team of this.state.teams){
            teamElements.push(<TeamPanel key={team.id} team={team} />);
        }
        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <div className='panel panel-primary' style={{marginRight:'40px', minWidth:'150px'}}>
                        <div className="panel-body">
                            <button onClick={this.goBtnClicked.bind(this)} className="btn btn-success" style={{marginBottom:'10px'}}>Go!</button>
                            <div style={{display:'flex'}}>
                                <label>Room ID: </label>
                                <p>{this.state.id}</p>
                            </div>
                            <div style={{display:'flex'}}>
                                <label>Password: </label>
                                <p>{this.state.password}</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{display:'flex'}}>
                    {teamElements}
                </div>
            </div>
        )
    }
}
