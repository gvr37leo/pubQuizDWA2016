import React from 'react';

export default class WaitingRoom extends React.Component{
    constructor(props){
        super(props)
        this.state = {};

        
    }

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-body">                        
                        <p>Wait for quizmaster to select a question</p>
                    </div>
                </div>
            </div>
        )
    }
}
