import React from 'react';

export default class teamPanel extends React.Component{
    constructor(props){
        super(props)
    }

    btnApprovedClicked(evt){

    }

    render(){
        var button = null;
        if(!this.props.team.approved){
            button = <button onClick={this.btnApprovedClicked.bind(this)} className="btn btn-default">X</button>
        }
        return(
            <div className='panel panel-primary' style={{margin:'40px', minWidth:'150px'}}>
                <div className="panel-heading">{this.props.team.name}</div>
                <div className="panel-body">
                    {button}
                </div>
            </div>
        )
    }
}
