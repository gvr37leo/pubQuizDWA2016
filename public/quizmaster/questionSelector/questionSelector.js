import React from 'react';
import Question from './question/question';

export default class QuestionSelector extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.state.questions = []
        this.props.webIO.on('questions', (data) => {
            this.setState({
                questions: data.questions
            });
        })
    }

    btnQuestionClicked(){


        this.props.btnQuestionClicked();
    }

    render(){
        var questionElements = [];
        var i = 0;
        for(var question of this.state.questions){
            questionElements.push(<Question
                index={i}
                key={question._id}
                question={question}
                webIO={this.props.webIO}
                btnQuestionClicked = {this.btnQuestionClicked.bind(this)}
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
