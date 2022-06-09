const generateMessage = (data) => {
    return {
        username: data.username,
        text: data.text,
        createdAt: new Date().getTime()
    }
}

const generateLoactionMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLoactionMessage
}