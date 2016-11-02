import React from 'react';
import TeamStatus from './teamStatus/teamStatus';

export default class ScoreDisplay extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        var room = this.props.room;
        var teamElements = [];
        if(room){
            for(var team of room.teams){
                teamElements.push(<TeamStatus key={team.id} team={team} webIO={this.props.webIO}/>);
            }
        }else{
            room = {};
        }

        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <div className='panel panel-primary'>
                        <div className="panel-body">
                            <button className="btn btn-success" style={{marginBottom:'10px'}}>Next</button>
                            <div style={{display:'flex'}}>
                                <label>Question: </label>
                                <p>{room.question}</p>
                            </div>
                            <div style={{display:'flex'}}>
                                <label>Category: </label>
                                <p>{room.category}</p>
                            </div>
                            <div style={{display:'flex'}}>
                                <label>Question #: </label>
                                <p>{room.questionCount}</p>
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