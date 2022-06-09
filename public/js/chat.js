const socket = io()

// Elements
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormLocation = document.getElementById("send-location")
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visable height
    const visableHeight = $messages.offsetHeight
    //Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far I scrolled ?
    const scrollOffset = $messages.scrollTop + visableHeight

    if (Math.round(containerHeight - newMessageHeight - 1) <= Math.round(scrollOffset)) {
        $messages.scrollTop = $messages.scrollHeight;
    }

    // if (containerHeight - newMessageHeight <= scrollOffset) {
    //     $messages.scrollTop = $messages.scrollHeight
    // }
}

socket.on('message', (val) => {
    console.log(val)
    const html = Mustache.render(messageTemplate, {
        username: val.username,
        message: val.text,
        createdAt: moment(val.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (me) => {
    console.log(me.url)
    console.log(me.createdAt)
    const html = Mustache.render(locationTemplate, {
        username: me.username,
        message: me.url,
        createdAt: moment(me.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const z = e.target.elements.message.value
    socket.emit('sendMessage', z, (error) => {

        //enabled
        $messageFormButton.removeAttribute('disabled')

        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

document.getElementById("send-location").addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not Supported for your browser")
    }
    $messageFormLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        $messageFormLocation.removeAttribute('disabled')
        const a = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        socket.emit('send-location', a, () => {
            console.log("Location shared")
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})