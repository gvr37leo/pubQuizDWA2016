class WebIO{
    constructor(socket){
        var that = this;
        this.socket = socket;
        this.routeMap = {}
        socket.on('message', function(data){
            var parsedData = JSON.parse(data);
            if(that.routeMap[parsedData.route]){
                that.routeMap[parsedData.route](parsedData)
            }else{
                console.log('404 route not found')
            }
        })
    }

    on(route, action){//actions need to be passed using an arrow function or functions binded with .bind(this)
        this.routeMap[route] = action;
    }
}

module.exports = WebIO;
