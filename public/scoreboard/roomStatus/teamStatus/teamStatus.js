import React from 'react';

export default class TeamDisplayer extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className='panel panel-primary' style={{marginRight:'40px', minWidth:'150px'}}>
                <div className="panel-heading">{this.props.team.name}</div>
                <div className="panel-body">
                    <div style={{display:'flex'}}>
                        <label>Round points: </label>
                        <p>{this.props.team.roundPoints}</p>
                    </div>
                    <div style={{display:'flex'}}>
                        <label>correct questions: </label>
                        <p>{this.props.team.score}</p>
                    </div>
                </div>
            </div>
        )
    }
}