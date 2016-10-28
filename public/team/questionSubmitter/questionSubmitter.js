import React from 'react';

export default class QuestionSubmitter extends React.Component{
    constructor(props){
        super(props)
        this.state = {};

        this.props.webIO.on('questionUpdate', (data) => {
            this.setState({question: data.question})
        })
    }

    answerChange(event){
        this.setState({answer: event.target.value})
    }

    answerBtnClicked(){
        this.props.webIO.send('sendanswer',{
            'answer':this.state.answer
        })
    }

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-body">
                        <p>{this.state.question}</p>
                        <input value={this.state.answer} onChange={this.answerChange.bind(this)} type="text" placeholder='Answer' className="form-control"/>
                        <button onClick={this.answerBtnClicked.bind(this)} className="btn btn-default">Answer</button>
                    </div>
                </div>
            </div>
        )
    }
}
