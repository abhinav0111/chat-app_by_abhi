const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!!'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users[index]
    }
    return undefined
}

const getUsersInRoom = (room) => {
    const ids = users.filter((user) => user.room === room)
    return ids
}

module.exports = {
    addUser, removeUser, getUser, getUsersInRoom
}

// addUser({
//     id: 22,
//     username: 'Abhinav',
//     room: 'vzm'
// })

// addUser({
//     id: 23,
//     username: 'Virat',
//     room: 'vzm'
// })

// addUser({
//     id: 24,
//     username: 'babbu',
//     room: 'usa'
// })
// // const res = addUser({
// //     id: 23,
// //     username: ' ',
// //     room: 'vzm'
// // })

// console.log(users)
// console.log(getUser(25))
// console.log(getUsersInRoom('vskp'))

// // const removeUserr = removeUser(22)

// // console.log(removeUserr)
// // console.log(users)