import { Server } from "socket.io";
import { createServer } from 'http'
import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'
import fs from 'fs'
import functions from './src/functions/Functions.js'
import { Resolver } from "dns";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5000'
    }
});
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/static', express.static(path.join(__dirname, 'public/static')))


const dbUsers = JSON.parse(fs.readFileSync(__dirname+'/src/db/users.json'))
const dbMsg = JSON.parse(fs.readFileSync(__dirname+'/src/db/msg.json'))
const usersOn = {}










function init() {
    console.log('Servidor ativo!!!')
    setUsersListOn()

    initMsgTempDb()
}



function initMsgTempDb () {
    if (Object.keys(dbMsg).length == 0) {
        const t = {}
        for (let key in dbUsers) {
            t[dbUsers[key].userName] = {}
        }
        fs.writeFileSync(__dirname+'/src/db/msg.json', JSON.stringify(t))
    }
}



function setUsersListOn() {
    for (let key in dbUsers) {
        usersOn[dbUsers[key].userName] = {
            socketId: '',
            status: 0
        }
    }
}



function getFriends(amigos, db) {
    const t = amigos.map(i => {
        return {
            userName: db[i].userName,
            apelido: db[i].apelido
        }
    })
    return t
}




function getMsgNotReceived(userName, dbMsg) {
    const t = dbMsg[userName]
    dbMsg[userName] = {}
    fs.writeFileSync(__dirname+'/src/db/msg.json', JSON.stringify(dbMsg))
    return t
}



function setMsgTemp(db, data) {
    if (db[data.for][data.origin] == undefined) {
        db[data.for][data.origin] = [data.msg]
        fs.writeFileSync(__dirname+'/src/db/msg.json', JSON.stringify(db))
        return
    }
    db[data.for][data.origin].push(data.msg)
    fs.writeFileSync(__dirname+'/src/db/msg.json', JSON.stringify(db))
}







app.get('/login', (req, res) => {
    res.sendFile(__dirname+'/public/login.html')
})

app.get('/', (req, res) => {
    console.log(req.cookies)
})



app.post('/login', (req, res) => {
    const data = req.body
    console.clear()

    //Novo login
    if (data.userName != undefined && data.senha != undefined && data.randomKey == undefined) {
        for (let key in dbUsers) {
            if (data.userName === dbUsers[key].userName && data.senha === dbUsers[key].senha) {
                const bodyCookie = {userName: data.userName,randoKey: data.randomKey}




                res.cookie('userName', data.userName)
                res.cookie('randomKey', dbUsers[key].randomKey)
                res.json({
                    userName: dbUsers[key].userName,
                    apelido: dbUsers[key].apelido,
                    amigos: getFriends(dbUsers[key].amigosId, dbUsers),
                    randomKey: dbUsers[key].randomKey,
                    msgsNotReceived: getMsgNotReceived(data.userName, dbMsg)
                })
                console.log('Novo login de '+data.userName)
                return
            }
        }
    }


    //Continuar login
    if (data.userName != undefined && data.randomKey != undefined) {
        for (let key in dbUsers) {
            if (data.userName === dbUsers[key].userName && data.randomKey === dbUsers[key].randomKey) {
                res.json({
                    userName: dbUsers[key].userName,
                    apelido: dbUsers[key].apelido,
                    amigos: getFriends(dbUsers[key].amigosId, dbUsers),
                    randomKey: dbUsers[key].randomKey,
                    msgsNotReceived: getMsgNotReceived(data.userName, dbMsg)
                })
                console.log('Continuar login de '+data.userName)
                return
            } else if (data.userName === dbUsers[key].userName) {
                res.redirect('/login')
                return
            }
        }
    }
    res.send(false)
})







io.on("connection", (socket) => {
    const userName = socket.handshake.headers.username === undefined ? socket.handshake.auth.userName : socket.handshake.headers.username
    usersOn[userName] = { socketId: socket.id, status: 1 }
    console.log(userName +' conectado!!!')





    socket.on('msgSend', event => { // { for: event.for, msg: [ { text: 'olá', time: '20:30' } ] }

        


        if (usersOn[event.for].status != 0) {
            socket.to(usersOn[event.for].socketId).emit('msgReceive', { origin: userName, msg: event.msg })
        } else setMsgTemp(dbMsg, { origin: userName, for: event.for, msg: event.msg })

    })





    socket.on('disconnect', event => {
        usersOn[userName] = { socketId: '', status: 0 }
        console.log(`${userName} desconectou!!`)
    })




});






httpServer.listen(3000, init());