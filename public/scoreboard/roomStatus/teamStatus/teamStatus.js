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
                    {this.props.team.name}
                    {this.props.team.roundPoints}
                    {this.props.team.score}
                </div>
            </div>
        )
    }
}