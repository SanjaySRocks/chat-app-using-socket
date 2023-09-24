const socket = io();

const message_area = document.querySelector('.message__area')
const inputMessage = document.getElementById('inputMessage')
const btnSend = document.getElementById('btnSend');
const messageContainer = document.getElementById('message__container');
const topHead = document.getElementById('topHead')

function playAudio(){
    const audio = new Audio('received.mp3');
    audio.play()
}

function appendMessage(message, pos)
{
    if(pos === "left")
    {
        var msgFormat = 
    `<div class="card col-md-6 offset-md-12 message__left">
    <div class="card-body">
       ${message}
    </div>
    </div>`
    
    playAudio()
    
    }else if(pos === "right"){
        var msgFormat = 
    `<div class="card text-bg-primary col-md-6 offset-md-6 message__right">
    <div class="card-body">
       ${message}
    </div>
    </div>`
    }

    message_area.insertAdjacentHTML('beforeend',msgFormat)
    messageContainer.scrollTo(0, document.body.scrollHeight);
}

function setUser(name){
    const n = `<h4 class="text-center"> You joined chat room as ${name} </h4>`

    topHead.insertAdjacentHTML('beforeend', n)
}


let username = prompt("Enter your name:")

setUser(username);
socket.emit("user-connected", username)

inputMessage.focus();

socket.on('user-joined-chat', name =>{
    appendMessage(`${name} joined the chat!`, 'left');
})


socket.on('receive', data=>{
    appendMessage(`${data.name} : ${data.message}`, 'left')
})

socket.on('user-left-chat', name=>{
    appendMessage(`${name} left the chat!`, 'left')
})

btnSend.addEventListener('click', ()=>{
    const msg = inputMessage.value
    appendMessage(`You : ${msg}`, 'right')
    socket.emit('chat message', msg)
    inputMessage.value = '';
})

function handleSend(event){
    if(event.key == 'Enter')
    {
        const msg = inputMessage.value
        appendMessage(`You : ${msg}`, 'right')
        socket.emit('chat message', msg)
        inputMessage.value = '';
    }
}

inputMessage.addEventListener('keydown', handleSend);