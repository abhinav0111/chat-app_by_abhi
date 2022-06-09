const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLoactionMessage } = require('./utils/messages')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()                       //declaring Express
const server = http.createServer(app)
const io = socketio(server)                 //creating a server

const port = process.env.PORT || 3000                               //Declaring port for connection
const publicDirectoryPath = path.join(__dirname, '../public')       //Directory path setup 

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New Websocket connection')                        //Prints when new user connects


    socket.on('join', (options, callback) => {                    //makes to join the room
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage({ username: 'Admin', text: 'Welcome' }))         //Greetings message(only for 1st time of connection for newly connected user)
        const userii = getUser(socket.id)
        socket.broadcast.to(userii.room).emit('message', generateMessage({ username: userii.username, text: `${userii.username} has joined!` }))      //Displays in room that new user joined
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit  <---------------------------|
        //(here we have use 2nd line stmnts to only send inside the room ) --|
    })

    socket.on('send-location', (coords, callback) => {       //To Extract lat & long to get LOCATION & emit location to all
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLoactionMessage(user.username, `https://www.google.com/maps?q=${coords.lat},${coords.long}`))
        callback('Delivered')
    })



    socket.on('sendMessage', (me, callback) => {            //To Recieve message form USER and send -->  SERVER & emit to all
        const filter = new Filter()
        if (filter.isProfane(me)) {
            return callback('Profanity is not allowed!')
        }
        const user = getUser(socket.id)
        const userii = getUser(socket.id)
        io.to(userii.room).emit('message', generateMessage({ username: user.username, text: me }))
        callback()                     //generateMessage({ username: user.username, text: me }))
    })



    socket.on("locationMessage", (location) => {            //to print LOCATION
        console.log(location)
    })
    socket.on('disconnect', () => {                        //To emit all, that an User DISCONNECTED
        const userii = getUser(socket.id)
        const user = removeUser(socket.id)
        if (user) {
            io.to(userii.room).emit('message', generateMessage({ username: userii.username, text: `${userii.username} has left!` }))
            io.to(userii.room).emit('roomData', {
                room: userii.room,
                users: getUsersInRoom(userii.room)
            })
        }

    })

})



server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})