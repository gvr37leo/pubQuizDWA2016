import React from 'react';
import TeamPanel from './teamPanel/teamPanel';

export default class TeamApprover extends React.Component{
    constructor(props){
        super(props)
        this.teams = [{id:1, name:'cool'}, {id:2, name:'fruit'}];
        this.props.socket.onmessage = function(event){
            var data = JSON.parse(event.data);
        }
    }

    render(){
        var teamElements = [];
        for(var team of this.teams){
            teamElements.push(<TeamPanel key={team.id} team={team} />);
        }
        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <button className="btn btn-success">Go!</button>
                </div>
                <div style={{display:'flex'}}>
                    {teamElements}
                </div>
            </div>
        )
    }
}
