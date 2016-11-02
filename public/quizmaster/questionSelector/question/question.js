import React from 'react';

export default class Question extends React.Component{
    constructor(props){
        super(props)
    }

    btnQuestionClicked(evt){
        this.props.webIO.send('selectquestion',{index:this.props.index})
    }

    render(){
        return(
            <div style={{display:'flex', 'flexDirection':'column', 'alignItems':'center'}}>
                <b>{this.props.question.category}</b>
                <button className="btn btn-success"  onClick={this.btnQuestionClicked.bind(this)}
                    style={{margin:'0px 10px 0px 10px', whiteSpace:'normal', width:'200px'}}>
                    {this.props.question.question}
                </button>
            </div>
        )
    }
}
