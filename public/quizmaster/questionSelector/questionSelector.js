import React from 'react';
import Question from './question/question';

export default class QuestionSelector extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.state.questions = [{id:1, question:'wie', category:'culture'}, {id:2, question:'wat', category:'culture'}, {id:3, question:'waar', category:'culture'}]
    }

    render(){
        var questionElements = [];
        for(var question of this.state.questions){
            questionElements.push(<Question
                key={question.id}
                question={question}
                />)
        }

        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary" style={{padding:'40px', display:'flex'}}>
                    {questionElements}
                </div>

            </div>
        )
    }
}
