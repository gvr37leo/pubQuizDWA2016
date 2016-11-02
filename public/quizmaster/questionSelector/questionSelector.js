import React from 'react';
import Question from './question/question';

export default class QuestionSelector extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        
    }



    render(){
        var questionElements = [];
        var i = 0;
        for(var question of this.props.questions){
            questionElements.push(<Question
                index={i}
                key={question._id}
                question={question}
                webIO={this.props.webIO}
                />)
            i++;
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
