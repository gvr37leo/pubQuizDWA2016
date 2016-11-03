import React from 'react';
import TeamPanel from './teamPanel/teamPanel';

export default class TeamApprover extends React.Component{
    constructor(props){
        super(props)
        this.state = {};
    }

    goBtnClicked(){
        this.props.webIO.send('roundStart', {})
    }

    render(){
        var room = this.props.room
        var teamElements = [];
        for(var team of room.teams){
            teamElements.push(<TeamPanel key={team.id} team={team} webIO={this.props.webIO}/>);
        }
        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <div className='panel panel-primary' style={{marginRight:'40px', minWidth:'150px'}}>
                        <div className="panel-body">
                            <button onClick={this.goBtnClicked.bind(this)} className="btn btn-success" style={{marginBottom:'10px'}}>Go!</button>
                            <div style={{display:'flex'}}>
                                <label>Room ID: </label>
                                <p>{room.id}</p>
                            </div>
                            <div style={{display:'flex'}}>
                                <label>Password: </label>
                                <p>{room.password}</p>
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
