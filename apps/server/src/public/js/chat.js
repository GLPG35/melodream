const socket = io()
const userName = localStorage.getItem('name') || undefined
const uid = JSON.parse(localStorage.getItem('id')) || (localStorage.setItem('id', Date.now()), JSON.parse(localStorage.getItem('id')))
const messages = document.querySelector('.messages')
const allMessages = messages.querySelectorAll('.messageWrapper')
const input = document.querySelector('.inputMessage')
const writingStatus = document.querySelector('.topBar .writingStatus')
const notification = new Audio('/static/sounds/Pop.opus')
let windowIsFoused = true

window.addEventListener('focus', () => windowIsFoused = true)
window.addEventListener('blur', () => windowIsFoused = false)

const randomSeedColor = (id) => {
	let color = Math.floor(Math.abs(Math.sin(id) * 16777215)).toString(16)

	while (color.length < 6) {
		color = '0' + color
	}

	return color
}

const detectLinkOrImage = (string) => {
	let parsedString = string

	parsedString = parsedString.replace(/\!\[(.*?)\]\((.*)\)/gim, '<img src="$2" alt="$1" />')
	parsedString = parsedString.replace(/(?<!src=")(https?:\/\/[^\s]+)\b/gim, '<a href="$1" target="_blank">$1</a>')

	return parsedString
}

const remapMessages = () => {
	document.querySelectorAll('.messageWrapper').forEach(msg => {
		const id = msg.id
	
		if (id == uid) {
			msg.classList.add('current')
		}

		msg.querySelector('.name').style.color = `#${randomSeedColor(id)}`
		msg.querySelector('.message').innerHTML = detectLinkOrImage(msg.querySelector('.message').innerHTML)
	})

	document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
}

if (userName && allMessages) remapMessages()
else {
	document.querySelector('.chatContainer').insertAdjacentHTML('afterbegin', `
		<div class="nameContainer">
			<form class="nameSelector">
				<h3>Provide Username</h3>
				<div class="wrapper">
					<input type="text" name="username"
					maxlength="15" placeholder="Username" required />
					<button type="submit">Set</button>
				</div>
			</form>
		</div>
	`)

	const nameSelector = document.querySelector('.nameSelector')

	nameSelector.addEventListener('submit', e => {
		e.preventDefault()

		const username = e.target.username.value

		localStorage.setItem('name', username)

		const actualMessages = messages.querySelectorAll('.messageWrapper')
		
		if (actualMessages) {
			remapMessages()
		}

		document.querySelector('.nameContainer').remove()
	})
}

input.addEventListener('input', e => {
	const username = localStorage.getItem('name')

	if (e.target.value !== '') {
		socket.emit('start writing', { uid, user: username })
	} else {
		socket.emit('end writing', uid)
	}
})

document.querySelector('.sendMessage').addEventListener('submit', e => {
	e.preventDefault()

	const message = e.target.message.value.replace(/<[\s\S]*?>/g, '')
	const name = localStorage.getItem('name')

	const newMsg = {
		uid,
		name,
		message
	}

	if (message.length) socket.emit('add message', newMsg)

	e.target.message.value = ''
	socket.emit('end writing', uid)
})

socket.on('new message', ({ uid: id, name, message }) => {
	messages.insertAdjacentHTML('beforeend', `
		<div class="messageWrapper ${id == uid ? 'current' : ''}" id="${id}">
			<div class="name" style="color: #${randomSeedColor(id)}">
				${name}
			</div>
			<div class="message">
				${detectLinkOrImage(message)}
			</div>
		</div>
	`)

	if (id !== uid && !windowIsFoused) notification.play()

	document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
})

socket.on('user writing', usersWriting => {
	const mapUsers = usersWriting.filter(x => x.uid !== uid).map(x => x.user)

	if (mapUsers.length) {
		const text = `${new Intl.ListFormat('en').format(mapUsers)} ${mapUsers.length > 1 ? 'are' : 'is'} writing...`

		writingStatus.innerHTML = text
	} else writingStatus.innerHTML = ''
})