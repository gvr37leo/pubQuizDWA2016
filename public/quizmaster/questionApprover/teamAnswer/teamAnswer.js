import React from 'react';

export default class teamPanel extends React.Component{
    constructor(props){
        super(props)
    }

    btnApprovedClicked(evt){
        this.props.webIO.send('answerApproved', {id:this.props.team.id})
    }

    render(){
        var button = null;
        var style = 'success'
        if(!this.props.team.approved){
            style = 'primary'
            button = <button onClick={this.btnApprovedClicked.bind(this)} className="btn btn-default" style={{marginLeft:'5px'}}>
                <span className='glyphicon glyphicon-check'></span>
            </button>
        }
        return(
            <div className={'panel panel-' + style} style={{marginRight:'40px', minWidth:'150px'}}>
                <div className="panel-heading" style={{minHeight:'55px', display:'flex', alignItems:'center'}}>
                    {this.props.team.name}
                    {button}
                </div>
                <div className="panel-body">
                    {this.props.team.answer}
                </div>
            </div>
        )
    }
}
