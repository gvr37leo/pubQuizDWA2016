import React from 'react';

export default class QuestionSubmitter extends React.Component{
    constructor(props){
        super(props)
        this.state = {};
    }

    answerChange(event){
        this.setState({answer: event.target.value})
    }

    answerBtnClicked(){
				console.log('Sending answer');
        this.props.webIO.send('sendanswer',{
            'answer':this.state.answer
        })
				console.log('Answer send');
    }

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-body">
                        <p>{this.props.question}</p>
                        <input value={this.state.answer} onChange={this.answerChange.bind(this)} type="text" placeholder='Answer' className="form-control"/>
                        <button onClick={this.answerBtnClicked.bind(this)} className="btn btn-default">Answer</button>
                    </div>
                </div>
            </div>
        )
    }
}
