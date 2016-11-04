class WebIO{
    constructor(socket){
        this.socket = socket;
        this.routeMap = {};
        this.lastMessage = "NOPE";
        this.setupSocket();
    }

    setupSocket(){
      var that = this;
      this.socket.onmessage = function(event){
          var data = event.data
          var parsedData = JSON.parse(data);
          if(that.routeMap[parsedData.route]){
              that.routeMap[parsedData.route](parsedData);
          }else{
              console.log('404: ' + parsedData.route);
          }
      }

      this.socket.onclose = () =>{
          this.onclose();
      }
    }

    sendLastMessage(){
      if(this.socket.readyState==1){
        this.socket.send(JSON.stringify(this.lastMessage));
      }
    }

    on(route, action){//actions need to be passed using an arrow function or functions binded with .bind(this)
        this.routeMap[route] = action;
    }

    send(route, value){//value is object en geserialized
        value.route = route;
        this.lastMessage = value;
        if(this.socket.readyState==1){
          this.socket.send(JSON.stringify(value));
        }
    }

    onclose(){

    }

    close(){
        this.socket.close();
    }
}

module.exports = WebIO;
