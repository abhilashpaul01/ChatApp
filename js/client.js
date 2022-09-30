const socket=io('http://localhost:8080');

const users={};//used to take the users in the chat into consideration.Also, users[socket.id] is an important tool
//used to keep track of the uniquesness of a user in the chat

const textarea=document.querySelector('#textarea');
const messageArea=document.querySelector('.message-area');



let name;//take input from the user
do{
    name=prompt("Please enter your name: ");
}while(!name) 


socket.emit('new-user-joined',name);//trigger request to server when a new user joins


socket.on('user-joined',newusername=>{//return request to all users when a new user joined
    appendNewUserJoined(newusername,'incoming');
    scrollToBottom();
});


function appendNewUserJoined(newmsg,direction){//function triggers when a new user joins the chat
    let newele=document.createElement('div');
    newele.classList.add(direction,'message','enter_exit');

    let insideEle;
    /*we dont use the h4 tag as used in appendmessage in insideEle*/
    insideEle=`
        <p>${newmsg} has joined the chat</p> 
        `
    newele.innerHTML=insideEle;

    messageArea.append(newele);
}


textarea.addEventListener('keyup',(eventname)=>{/* eventname is a response that someone had typed on the 'text-area'*/
    if(eventname.key==="Enter"){ /* the key parameter is an inbuilt function for the event 'keyup'. it gives the key entered*/
        sendMessage(eventname.target.value);
        textarea.value='';
    }
})


//a new message has been sent and request has been forwarded to server
function sendMessage(msg){  /*This msg has only message...it is not an object*/
        let newmsg={ 
        username: name,  /* it is the name we got from prompt*/
        message: msg.trim()  /*trim is done because when passing the message parameter(lets say through socket.emit) 
        the new line after clicking 'enter, is also included in message which we dont want*/
    }
    appendMessage(newmsg,'outgoing');
    scrollToBottom();

    socket.emit('message_sent',newmsg);//request sent to the server for a new message
}

socket.on('message', newmsg=>{ //getting request from server to display sent message to all users
    appendMessage(newmsg,'incoming');
    scrollToBottom();
})


function appendMessage(newmsg, direction){//function triggers when a message is sent by a user
    let newele=document.createElement('div');
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

socket.on('leave',name=>{ //function triggers when a user has left the chat
    appendUserLeftChat(name,'incoming');
    scrollToBottom();
}); 


function appendUserLeftChat(newmsg,direction){//function triggers when a new user joins the chat
    let newele=document.createElement('div');
    newele.classList.add(direction,'message','enter_exit');

    let insideEle;
    /*we dont use the h4 tag as used in appendmessage in insideEle*/
    insideEle=`
        <p>${newmsg} has left the chat</p> 
        `
    newele.innerHTML=insideEle;

    messageArea.append(newele);
    
}


function scrollToBottom(){//function to make the scroll go to the bottom when there are too many messages
    messageArea.scrollTop=messageArea.scrollHeight;
}