import React from 'react';

export default class teamPanel extends React.Component{
    constructor(props){
        super(props)
    }

    btnDeclinedClicked(evt){
        this.props.webIO.send('teamdenied', {id:this.props.team.id})
    }

    render(){
        var button = null;
        if(!this.props.team.approved){
            button = <button onClick={this.btnDeclinedClicked.bind(this)} className="btn btn-default">X</button>
        }
        return(
            <div className='panel panel-primary' style={{marginRight:'40px', minWidth:'150px'}}>
                <div className="panel-heading">{this.props.team.name}</div>
                <div className="panel-body">
                    {button}
                </div>
            </div>
        )
    }
}
