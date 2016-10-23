import React from 'react';
import TeamAnswer from './teamAnswer/teamAnswer';

export default class QuestionApprover extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.state.answers = [{id:1, answer:'hij', team:'coolen boyz', approved:false}, {id:2, answer:'hullie', team:'horp', approved:true}]
    }

    render(){
        var answerElements = [];
        for(var answer of this.state.answers){
            answerElements.push(<TeamAnswer key={answer.id} answer={answer} />);
        }
        return(
            <div style={{margin:'20px'}}>
                <div style={{display:'flex', marginBottom:'20px'}}>
                    <button className="btn btn-success">Next</button>
                </div>
                <div style={{display:'flex'}}>
                    {answerElements}
                </div>
            </div>
        )
    }
}
