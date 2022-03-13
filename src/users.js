let users = []

function userJoin (id, username, avatar, room, isHost) {
  const user = { 
    id: id,
    username: username,
    avatar: avatar,
    room: room,
    isHost: isHost,
    voteReroll: 0
  }
  users.push(user)
  return user
}

function voteReroll (id) {
  users = users.map(user => {
    if (user.id === id) {
      user.voteReroll = true
    }
    return user
  })
}

function getUser (id)  {
  return users.find(user => user.id === id)
}

function getAllUsersInRoom(room) {
  return users.filter(user => user.room === room)
}

function getHostInRoom (room) {
  return users.find(user => user.room === room && user.isHost)
}

function getAllPlayersInRoom(room) {
  return users.filter(user => user.room === room && !user.isHost)
}

function removeUser(id) {
  users = users.filter(user => user.id !== id)
}

module.exports = {
  users,
  userJoin,
  voteReroll,
  getUser,
  getAllUsersInRoom,
  getHostInRoom,
  getAllPlayersInRoom,
  removeUser
}