import React from 'react';
import TeamAnswer from './teamAnswer/teamAnswer';

export default class QuestionApprover extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.state.teams = [];

        this.props.webIO.on('startquestion', (data) =>{
            this.setState({question:data.question})
        })

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
                    <div className='panel panel-primary'>
                        <div className="panel-body">

                            <button onClick={this.btnNextQuestionClicked.bind(this)} className="btn btn-success" style={{marginBottom:'10px'}}>Next</button>
                            <div style={{display:'flex'}}>
                                <label>Question: </label>
                                <p>{this.state.question}</p>
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
// <div className='panel panel-primary' style={{marginRight:'40px', minWidth:'150px'}}>
//     <div className="panel-body">
//         <button onClick={this.goBtnClicked.bind(this)} className="btn btn-success" style={{marginBottom:'10px'}}>Go!</button>
//         <div style={{display:'flex'}}>
//             <label>Room ID: </label>
//             <p>{this.state.id}</p>
//         </div>
//         <div style={{display:'flex'}}>
//             <label>Password: </label>
//             <p>{this.state.password}</p>
//         </div>
//     </div>
// </div>