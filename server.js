const express=require('express')

const app=express()
const http=require('http')
const {Server}=require('socket.io')

const server=http.createServer(app)
const user_details=[]
const old_messages=[]
let registered_user=""

const io=new Server(server)

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/index.html")
})

const PORT=4000;
io.on("connection",(socket)=>{

    console.log("user is connected")

    socket.on("register",(data)=>{
      user_details.push({...data,socket_id:socket.id})
      io.emit("registered_user",data.username)
      registered_user=data.username;
      console.log(old_messages)
      old_messages.map((user)=>{
        if(user.username==data.username )
        {
            io.to(socket.id).emit('send_message',user.message)
        }
        // if(user.by==registered_user)
        // {
        //     io.to(socket.id).emit('sent',user.message)
        // }
    })
      
   

    })
    socket.on("send_message",(data)=>{
         let {message,username}=data;
       
        old_messages.push({...data,"by":registered_user})
        user_details.map((user)=>{
            if(user.username==username )
            {
                console.log(user)
                socket.to(user.socket_id).emit('send_message',message)
            }
            
        })

    })



    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

})

server.listen(PORT,()=>{

    console.log(`server is running on port ${PORT}`)

})