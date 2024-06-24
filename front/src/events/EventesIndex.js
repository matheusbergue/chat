import { io } from 'socket.io-client';

const buttonSair = document.getElementById('sair')



const loginData = JSON.parse(localStorage.getItem('loginData'))
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



function attInfos () {

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

})











