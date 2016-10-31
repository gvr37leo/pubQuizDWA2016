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
        this.props.btnNextQuestionClicked();
    }

    render(){
        var teamElements = [];
        for(var team of this.state.teams){
            teamElements.push(<TeamAnswer key={team.id} team={team} webIO={this.props.webIO}/>);
        }
        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <button onClick={this.btnNextQuestionClicked.bind(this)} className="btn btn-success">Next</button>
                </div>
                <div style={{display:'flex'}}>
                    {teamElements}
                </div>
            </div>
        )
    }
}
