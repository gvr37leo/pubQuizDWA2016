import React from 'react';

export default class Login extends React.Component{
    constructor(props){
        super(props);
				this.state = {
					roomId: ""
				}
    }

		goBtnClicked(evt){
			evt.preventDefault();
			this.props.webIO.send('scoreboardjoin',{roomId: this.state.roomId});
		};

		onRoomFieldChange(evt){
			if(!isNaN(evt.target.value)){
				this.setState({roomId: evt.target.value});
			}
		};

    render(){
        return(
             <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <div className="panel panel-primary">
                    <div className="panel-heading">View a room</div>
                    <div className="panel-body">
                        <input placeholder='roomID' value={this.state.roomId} onChange={this.onRoomFieldChange.bind(this)} className="form-control"/>
                        <button onClick={this.goBtnClicked.bind(this)} className="btn btn-default">Go!</button>
                    </div>
                </div>

            </div>
        )
    }
}
