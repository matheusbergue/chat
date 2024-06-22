import { io } from 'socket.io-client';

const loginData = JSON.parse(localStorage.getItem('loginData'))
let socket = io('http://localhost:3000', {
    auth: {
        userName: loginData.userName,
    }
})






