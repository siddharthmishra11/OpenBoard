let express = require("express");
let socket = require("socket.io");

let app = express();
app.use(express.static('public'));
let server = app.listen(5500,()=>{
    console.log("app.listen is listening");
})

let io = socket(server);
io.on("connection",(socket)=>{
    //drawRect
    socket.on("drawRect",(data)=>{
        io.sockets.emit("drawRect",data);
    })
    //drawLine
    socket.on("drawLine",(data)=>{
        io.sockets.emit("drawLine",data);
    })
    //drawfill
    socket.on("drawfill",(data)=>{
        console.log("Imge Idhar aaya");
        io.sockets.emit("drawfill",data);
    })
    //trackerUpdate
    socket.on("trackerUpdate",(data)=>{
        io.sockets.emit("trackerUpdate",data);
    })
    //mouseMove
    socket.on("mouseMove",(data)=>{
        io.sockets.emit("mouseMove",data);
    })
    //undoRedo
    socket.on("undoRedo",(data)=>{
        io.sockets.emit("undoRedo",data);
    })
})