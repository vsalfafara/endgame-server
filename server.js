const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { userJoin, voteReroll, getUser, getAllUsersInRoom, getHostInRoom, getAllPlayersInRoom, removeUser } = require('./users.js')
const { resetSequence, incrementPointer, getTurn, determineSequence } = require('./sequence.js')
const crypto = require("crypto")
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const characters = require('./characters')
const e = require('express')
const { info } = require('console')

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send(200)
})

io.on('connection', (socket) => {

  socket.on('createRoom', ({username, avatar}) => {
    var room = crypto.randomBytes(10).toString('hex')
    const user = userJoin(socket.id, username, avatar, room, true)
    socket.join(user.room)
    socket.emit('getRoomId', room)
  })
  
  socket.on('joinRoom', ({username, avatar}, room) => {
    const user = userJoin(socket.id, username, avatar, room, false)
    socket.join(user.room)
    const users = getAllUsersInRoom(room)
    socket.broadcast.to(user.room).emit('getAllUsersInRoom', users)
    socket.emit('getRoomId', room)
    socket.emit('getUser', user)
  })

  socket.on('getUser', () => {
    const user = getUser(socket.id)
    socket.emit('getUser', user)
  })

  socket.on('getAllUsersInRoom', (room) => {
    const users = getAllUsersInRoom(room)
    socket.emit('getAllUsersInRoom', users)
  })

  socket.on('getAllPlayersInRoom', (room) => {
    const players = getAllPlayersInRoom(room)
    io.sockets.in(room).emit('getAllPlayersInRoom', players)
  })

  socket.on('boss', (data) => {
    io.in(data.room).emit('showBoss', data.boss)
  })
  
  socket.on('startPhase', (data) => {
    io.sockets.in(data.room).emit('startPhase', data.mode)
  })

  socket.on('showPanel', (room) => {
    io.sockets.in(room).emit('showPanel')
  })

  socket.on('determineSequence', (data) => {
    const players = getAllPlayersInRoom(data.room)
    determineSequence(data.mode, players)
  })

  socket.on('nextTurn', () => {
    clearInterval(selectTimer)
    incrementPointer()
    const turn = getTurn()
    if (turn) {
      io.sockets.in(turn.player.room).emit('announceSelect', { id: turn.player.id, name: turn.player.username, type: turn.selection})
      io.to(turn.player.id).emit('select', turn.selection)
      const host = getHostInRoom(turn.player.room)
      io.to(host.id).emit('startTimeSelect')
    }
  })

  socket.on('enter', data => {
    io.in(data.room).emit('removeCharacterFromPanel', data)
    const host = getHostInRoom(data.room)
    io.to(host.id).emit('nextTurn')
  })

  let counter = null
  let selectTimer = null
  let rerollTimer = null

  socket.on('startTimeSelect', () => {
    counter = 31
    const turn = getTurn()
    selectTimer = setInterval( () => {
      counter--
      io.sockets.in(turn.player.room).emit('counter', counter)
      if (counter === 0) {
        io.to(turn.player.id).emit('pickDefault', turn)
        clearInterval(selectTimer)
      }
    }, 1000)
  })

  socket.on('startTimeReroll', (room) => {
    counter = 11
    rerollTimer = setInterval( () => {
      counter--
      io.sockets.in(room).emit('counter', counter)
      console.log(counter)
      if (counter === 0) {
        const host = getHostInRoom(room)
        const players = getAllPlayersInRoom(room)
        io.to(host.id).emit('determineReroll', players)
        clearInterval(rerollTimer)
      }
    }, 1000)
  })

  socket.on('reroll', (data) => {
    voteReroll(data)
  })

  socket.on('reset', (room) => {
    counter = null
    clearInterval(selectTimer)
    clearInterval(rerollTimer)
    resetSequence()
    io.sockets.in(room).emit('reset')
  })

  socket.on('disconnect', () => {
    const user = getUser(socket.id)
    if (user) {
      removeUser(user.id)
      const users = getAllUsersInRoom(user.room)
      if (!users.length) {
        resetSequence()
        clearInterval(selectTimer)
        clearInterval(rerollTimer)
        timer = null
      }
    }
    console.log('user disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})