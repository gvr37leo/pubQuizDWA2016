import React from 'react';
import TeamAnswer from './teamAnswer/teamAnswer';

export default class QuestionApprover extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.state.teams = [];
        this.props.webIO.on('answerchanged', (data) => {
            this.setState({teams:data.room.teams})
        })
    }

    btnNextQuestionClicked(){
        this.props.webIO.send('roundStart', {});
    }

    render(){
        var teamElements = [];
        for(var team of this.state.teams){
            teamElements.push(<TeamAnswer key={team.id} team={team} webIO={this.props.webIO}/>);
        }
        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <div className='panel panel-primary'>
                        <div className="panel-body">

                            <button onClick={this.btnNextQuestionClicked.bind(this)} className="btn btn-success" style={{marginBottom:'10px'}}>Next</button>
                            <div style={{display:'flex'}}>
                                <label>Question: </label>
                                <p>{this.props.question}</p>
                            </div>
														<div style={{display:'flex'}}>
                                <label>Answer: </label>
                                <p>{this.props.answer}</p>
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