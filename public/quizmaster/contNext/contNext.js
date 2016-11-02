import React from 'react';

export default class ContNext extends React.Component{
    constructor(props){
        super(props)
        this.state = {}

    }

    contBtnClicked(){
        this.props.webIO.send('continue', {})
    }

    stopBtnClicked(){
        this.props.webIO.send('stop', {})
        this.props.stopBtnClicked();
    }

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-body">
                        <button onClick={this.contBtnClicked.bind(this)} className="btn btn-default">Continue</button>
                        <button onClick={this.stopBtnClicked.bind(this)} className="btn btn-default">Stop</button>
                    </div>
                </div>
            </div>
        )
    }
}
