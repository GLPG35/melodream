const socket = io()
const userName = localStorage.getItem('name') || undefined
const uid = localStorage.getItem('id') || (localStorage.setItem('id', Date.now()), localStorage.getItem('id'))
const messages = document.querySelector('.messages')
const allMessages = messages.querySelectorAll('.messageWrapper')

const randomSeedColor = (id) => {
	const color = Math.floor(Math.abs(Math.sin(id) * 16777215)).toString(16)

	while (color.length < 6) {
		color = '0' + color
	}

	return color
}

const remapMessages = () => {
	document.querySelectorAll('.messageWrapper').forEach(msg => {
		const id = msg.id
	
		if (id == uid) {
			msg.classList.add('current')
		}

		msg.querySelector('.name').style.color = `#${randomSeedColor(id)}`
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

document.querySelector('.sendMessage').addEventListener('submit', e => {
	e.preventDefault()

	const message = e.target.message.value
	const name = localStorage.getItem('name')

	const newMsg = {
		id: uid,
		name,
		message
	}

	socket.emit('add message', newMsg)

	e.target.message.value = ''
})

socket.on('new message', ({ id, name, message }) => {
	messages.insertAdjacentHTML('beforeend', `
		<div class="messageWrapper ${id == uid ? 'current' : ''}" id="${id}">
			<div class="name" style="color: #${randomSeedColor(id)}">
				${name}
			</div>
			<div class="message">
				${message}
			</div>
		</div>
	`)

	document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
})