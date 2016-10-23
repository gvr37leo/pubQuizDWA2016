import React from 'react';

export default class teamPanel extends React.Component{
    constructor(props){
        super(props)
    }

    btnApprovedClicked(evt){

    }

    render(){
        var button = null;
        if(!this.props.answer.approved){
            button = <button onClick={this.btnApprovedClicked.bind(this)} className="btn btn-default" style={{marginLeft:'5px'}}>X</button>
        }
        return(
            <div className='panel panel-primary' style={{marginRight:'40px', minWidth:'150px'}}>
                <div className="panel-heading" style={{minHeight:'55px', display:'flex', alignItems:'center'}}>
                    {this.props.answer.team}
                    {button}
                </div>
                <div className="panel-body">
                    {this.props.answer.answer}
                </div>
            </div>
        )
    }
}
