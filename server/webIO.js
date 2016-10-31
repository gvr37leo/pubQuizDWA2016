class WebIO{
    constructor(socket){
        var that = this;
        this.socket = socket;
        this.routeMap = {}
        socket.onmessage = function(event){
            var data = event.data
            var parsedData = JSON.parse(data);
            if(that.routeMap[parsedData.route]){
                that.routeMap[parsedData.route](parsedData)
            }else{
                console.log('404 route not found')
            }
        }
    }

    on(route, action){//actions need to be passed using an arrow function or functions binded with .bind(this)
        this.routeMap[route] = action;
    }

    send(route, value){//value is object en geserialized
        value.route = route;
        this.socket.send(JSON.stringify(value))
    }

    close(){
        this.socket.close();
    }
}

module.exports = WebIO;
