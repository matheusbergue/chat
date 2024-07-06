import { io } from 'socket.io-client';

const usersList = document.getElementById('users-list')

const buttonSair = document.getElementById('sair')
const friendButton = document.getElementsByClassName('user-select')
const chatArea = document.getElementById('chat-area')
const empetyChat = document.getElementById('empety-chat')
const sendButton = document.getElementById('input-button')
const inputText = document.getElementById('input-text')
const msgArea = document.getElementById('msgArea')
const apelidoCabecalho = document.getElementById('apelido-cabecalho')
const inputBeckChat = document.getElementById('input-beck')

const loginData = JSON.parse(localStorage.getItem('loginData'))
if (!loginData) window.location.replace('/login.html')
let socket = io('http://192.168.0.102:3000', {
    auth: {
        userName: loginData.userName,
    }
})



function resetLogin() {
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace('/login.html')
}

function createUserElement(data) {
    const div = document.createElement('div')
    div.setAttribute('class', 'user-select')
    div.setAttribute('apelido', data.apelido)
    div.setAttribute('name', data.userName)
    div.innerHTML = `<span>${data.apelido}</span>`
    return div
}

function attInfos () {
    loginData.amigos.map(i => {
        usersList.appendChild(createUserElement(i))
    })
}

function clickFriendEvent() {
    for (let i = 0; friendButton.length > i; i++) {
        friendButton[i].addEventListener('click', event => {
            sessionStorage.setItem('userSelected', friendButton[i].getAttribute('name'))
            apelidoCabecalho.innerHTML =friendButton[i].getAttribute('apelido')
            empetyChat.style.display = 'none'
            chatArea.style.display = 'grid'
            const t = JSON.parse(localStorage.getItem(friendButton[i].getAttribute('name')))
            let y = ''
            t.map(o => {
                if (o.origin == 0) {
                    y = y+`<div class="send-msg">${o.text}</div>`
                } else {
                    y = y+`<div class="receive-msg">${o.text}</div>`
                }
            })
            msgArea.innerHTML = y
            msgArea.scroll({top: msgArea.scrollHeight})
            if (window.innerWidth <= 800) {
                usersList.style.display = 'none'
            }
        })
    }
}

async function tempTest (d) {
    const data = {
        body: JSON.stringify({ userName: loginData.userName, randomKey: loginData.randomKey }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('http://localhost:3000/login', data)
    const body = await response.json()
    if (body != false) {
        localStorage.setItem('loginData', JSON.stringify(body))
    } else resetLogin()
}

function sendMsg(para, msg) {
    const alvo = JSON.parse(localStorage.getItem(para))
    if (alvo == null && alvo == undefined && alvo == false) { localStorage.setItem(para, JSON.stringify([msg])); return }
    alvo.push(msg)
    localStorage.setItem(para, JSON.stringify(alvo))
    msgArea.appendChild(createMsgElement('send-msg', msg.text))
    msgArea.scroll({top: msgArea.scrollHeight + 999999999, behavior: 'smooth' })
    socket.emit('msgSend', {
        for: sessionStorage.getItem('userSelected'),
        msg: { text: inputText.value, time: '14:20' }
    })
    inputText.value = ''
}

function receiveMsg(para, msg) {
    const alvo = JSON.parse(localStorage.getItem(para))
    if (alvo == null && alvo == undefined && alvo == false) { localStorage.setItem(para, JSON.stringify([msg])); return }
    alvo.push(msg)
    localStorage.setItem(para, JSON.stringify(alvo))
    msgArea.appendChild(createMsgElement('receive-msg', msg.text))
    msgArea.scroll({top: msgArea.scrollHeight + 999999999, behavior: 'smooth' })
}

function initChats() {
    loginData.amigos.map(i => {
        if (JSON.parse(localStorage.getItem(i.userName)) != null) return
        localStorage.setItem(i.userName, JSON.stringify([]))
    })
}

function createMsgElement(mode, msg) {
    const div = document.createElement('div')
    div.setAttribute('class', mode)
    div.innerHTML = msg
    return div
}

window.addEventListener('load', event => {
    const tempData = JSON.parse(sessionStorage.getItem('l'))
    if (!tempData) tempTest()
    attInfos()
    clickFriendEvent()    
    initChats()

    
})

window.addEventListener('keyup', event => {
    if (event.key == 'Enter') {
        sendMsg(sessionStorage.getItem('userSelected'), {
            text: inputText.value,
            time: '20:30',
            origin: 0
        })
    }
})

sendButton.addEventListener('click', event => {
    sendMsg(sessionStorage.getItem('userSelected'), {
        text: inputText.value,
        time: '20:30',
        origin: 0
    })
})

inputBeckChat.addEventListener('click', event => {
    chatArea.style.display = 'none'
    usersList.style.display = 'initial'
})


buttonSair.addEventListener('click', resetLogin)


socket.on('msgReceive', data => {
    if (data.origin == sessionStorage.getItem('userSelected')) {
        receiveMsg(sessionStorage.getItem('userSelected'), {
            text: data.msg.text,
            time: data.msg.time,
            origin: 1
        })
    }
})