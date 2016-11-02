import React from 'react';

export default class RoomPicker extends React.Component{
    constructor(props){
        super(props)
        this.state = {};
    }

    roomIdChange(event){
        this.setState({roomId: event.target.value});
    }

    roomPasswordChange(event){
        this.setState({roomPassword: event.target.value});
    }

    goBtnClicked(event){
        this.props.webIO.send('scoreBoardLogin', {
            roomId:this.state.roomId,
            password: this.state.roomPassword,
        })
        this.props.loginBtnClicked();
    }

    render(){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-heading">Join a room</div>
                    <div className="panel-body">
                        <input value={this.state.roomId} onChange={this.roomIdChange.bind(this)} type="text" placeholder='roomId' className="form-control"/>
                        <input value={this.state.roomPassword} onChange={this.roomPasswordChange.bind(this)} type="text" placeholder='roomPassword' className="form-control"/>
                        <button onClick={this.goBtnClicked.bind(this)} className="btn btn-default">Go!</button>
                    </div>
                </div>
            </div>
        )
    }
}
