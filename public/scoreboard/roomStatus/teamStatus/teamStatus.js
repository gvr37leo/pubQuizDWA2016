import React from 'react';

export default class TeamDisplayer extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        var answer = null;
        var style = 'primary';
        if(this.props.showAnswers){
            answer = <div>
                <div style={{display:'flex'}}>
                    <label>correct questions: </label>
                    <p>{this.props.team.score}</p>
                </div>
                <div style={{display:'flex'}}>
                    <label>Answer: </label>
                    <p>{this.props.team.answer}</p>
                </div>
            </div>
            if(this.props.team.approved){
                style = 'succes';
            }
        }
        return(
            <div className={'panel panel-' + style} style={{marginRight:'40px', minWidth:'150px'}}>
                <div className="panel-heading">{this.props.team.name}</div>
                <div className="panel-body">
                    <div style={{display:'flex'}}>
                        <label>Round points: </label>
                        <p>{this.props.team.roundPoints}</p>
                    </div>
                    {answer}
                </div>
            </div>
        )
    }
}