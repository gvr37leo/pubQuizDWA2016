import React from 'react';

export default class RoomCreator extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.state.roomPassword = ""

    }

    goBtnClicked(){
        this.props.socket.send(JSON.stringify({password:'test'}))
    }

    roomPasswordChange(event){
        this.setState({roomPassword: event.target.value});
        // this.state. = event.target.value
    }

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-heading">Create a room</div>
                    <div className="panel-body">
                        <input value={this.state.roomPassword} onChange={this.roomPasswordChange.bind(this)} type="text" className="form-control"/>
                        <button onClick={this.goBtnClicked.bind(this)} className="btn btn-default">Go!</button>
                    </div>
                </div>

            </div>

        )
    }
}
