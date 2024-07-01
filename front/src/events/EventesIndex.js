import { io } from 'socket.io-client';

const usersList = document.getElementById('users-list')

const buttonSair = document.getElementById('sair')
const friendButton = document.getElementsByClassName('user-select')
const cabecalhoChatArea = document.getElementById('cabecalho')
const chatArea = document.getElementById('chat-area')
const empetyChat = document.getElementById('empety-chat')



const loginData = JSON.parse(localStorage.getItem('loginData'))

if (!loginData) window.location.replace('/login.html')

let socket = io('http://localhost:3000', {
    auth: {
        userName: loginData.userName,
    }
})


buttonSair.addEventListener('click', resetLogin)


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
            cabecalhoChatArea.innerHTML = `<span>${friendButton[i].getAttribute('apelido')}</span>`
            empetyChat.style.display = 'none'
            chatArea.style.display = 'grid'
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



window.addEventListener('load', event => {
    const tempData = JSON.parse(sessionStorage.getItem('l'))
    if (!tempData) tempTest()
    attInfos()
    clickFriendEvent()
    
})











