import React from 'react';

export default class QuestionSubmitter extends React.Component{
    constructor(props){
        super(props)
        this.state = {allowedToSend: true};
				setTimeout(function() { this.setState({allowedToSend:false}); }.bind(this), this.props.time*1000);
    }

    answerChange(event){
        this.setState({answer: event.target.value})
    }

    answerBtnClicked(){
				if(this.state.allowedToSend){
		      this.props.webIO.send('sendanswer',{
		          'answer':this.state.answer
		      });
				}
		}

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-body">
                        <p>{this.props.question}</p>
                        <input value={this.state.answer} onChange={this.answerChange.bind(this)} type="text" placeholder='Answer' className="form-control"/>
                        <button disabled={!this.state.allowedToSend} onClick={this.answerBtnClicked.bind(this)} className="btn btn-default">Answer</button>
                    </div>
                </div>
            </div>
        )
    }
}
