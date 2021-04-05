const app = require('./app')
const port = process.env.PORT

const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
    cors: {
        origins: [process.env.CLIENT_URL]
    }
})

io.on("connection", socket => { 
    console.log("WebSockets conn is established")
});

global.io = io

httpServer.listen(port, () => {
    console.log('App is up on port ' + port)
})