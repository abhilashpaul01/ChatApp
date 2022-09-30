const users={};
const io = require('socket.io')(8080, {
    cors: {
      origin: '*',
    }
  });
io.on('connection', socket =>{

    socket.on('message_sent',msg=>{
        socket.broadcast.emit('message',msg);
    })

    socket.on('new-user-joined',name =>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('disconnect',message=>{//here message is not needed to use anywhere
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    })
})