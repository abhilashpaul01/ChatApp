const socket=io('http://localhost:8080');

const textarea=document.querySelector('#textarea');
const messageArea=document.querySelector('.message-area');
// const messageInput=document.getElementById('messageinp');
// const messagecontainer=document.querySelector(".container");
// var notification= new Audio('notif.mp3');

// const addbox=(message,position)=>{
//     const Element=document.createElement('div');
//     Element.innerText=message;
//     Element.classList.add('message');
//     Element.classList.add(position);
//     messagecontainer.append(Element);
//     if(position=='left'){
//         notification.play();
//     }
// }
// form.addEventListener('submit',(currevent)=>{
//     currevent.preventDefault();
//     const message= messageInput.value;
//     addbox(`${message}`,'right');
//     socket.emit('send',message);
//     messageInput.value='';
    
// })
let name;
do{
    name=prompt("Please enter your name: ");
}while(!name) 
socket.emit('new-user-joined',name);

socket.on('user-joined',newusername=>{
        appendMessage(`${newusername} has joined the chat`,'incoming');
    });

textarea.addEventListener('keyup',(eventname)=>{/* eventname is a string message that is typed by someone on the 'text-area'*/
    if(eventname.key==="Enter"){ /* the key parameter is an inbuilt function for the event 'keyup'. it gives the key entered*/
        sendMessage(eventname.target.value);
        textarea.value='';
    }
})

function sendMessage(msg){  /*This msg has only message...it is not an object(this msg and the one in second line are differnt*/ 
        let newmsg={    /* How are we able to use the local variable msg inside the append function*/
        username: name,  /* it is the name we got from prompt*/
        message: msg.trim()  /*trim is done because when passing the message parameter(lets say through socket.emit) the new line after clicking 'enter, is also included in message which we dont want*/
    }
    appendMessage(newmsg,'outgoing');
    scrollToBottom();

    socket.emit('message_sent',newmsg);
}

function appendMessage(newmsg, direction){
    let newele=document.createElement('div');
    // let className=direction;
    newele.classList.add(direction,'message');

    let insideEle;
    
    if(direction=='outgoing'){
        insideEle=`
        <h4>You</h4>
        <p>${newmsg.message}</p>
        `
    }
    else{
        insideEle=`
        <h4>${newmsg.username}</h4>
        <p>${newmsg.message}</p>
        `
    }

    newele.innerHTML=insideEle;

    messageArea.append(newele);
}

socket.on('message', newmsg=>{
    appendMessage(newmsg,'incoming');
    scrollToBottom();
})

function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
}


// const name=prompt("Please enter your name");
// socket.emit('new-user-joined',name);

// socket.on('user-joined',name=>{
//     addbox(`${name} has joined the chat`,'left');
// });

// socket.on('receive',data=>{
//     addbox(`${data.name}:  ${data.message}`, 'left');
// });

// socket.on('leave',name=>{
//     addbox(`${name} has left the chat`,'left');
// });