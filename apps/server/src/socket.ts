import { Server } from 'socket.io'
import http from 'http'
import * as fs from 'fs/promises'

const io = (httpServer: http.Server) => {
	const io = new Server(httpServer, {
		cors: {
			origin: '*'
		}
	})

	const usersWriting: {id: number, user: string}[] = []
	
	io.on('connection', socket => {
		let timer: NodeJS.Timeout

		const debounce = (func: () => any, timeout: number) => {
			clearTimeout(timer)
			timer = globalThis.setTimeout(func, timeout)
		}
		
		socket.on('add message', async msgData => {
			const { message } = msgData
			const parsedMessage = message.replace(/<[\s\S]*?>/g, '')

			if (parsedMessage.length) {
				const messages = await fs.readFile(__dirname + '/public/messages.json', 'utf-8')
					.then((data: any) => JSON.parse(data))
					.catch(() => [])
	
				messages.push(msgData)
		
				io.emit('new message', msgData)
		
				fs.writeFile(__dirname + '/public/messages.json', JSON.stringify(messages, null, '\t'), 'utf-8')
				.catch(console.error)
			}
		})

		// Check if user is writing
		socket.on('start writing', ({ id, user }) => {
			const findUser = usersWriting.find(x => x.id == id)
			
			if (!findUser) usersWriting.push({id: +id, user})

			io.emit('user writing', usersWriting)

			const endWriting = () => {
				const findUser = usersWriting.findIndex(x => x.id == id)

				if (findUser != -1) usersWriting.splice(findUser, 1)

				io.emit('user writing', usersWriting)
			}
			
			debounce(endWriting, 3000)
		})

		socket.on('end writing', id => {
			const findUser = usersWriting.findIndex(x => x.id == id)

			if (findUser != -1) usersWriting.splice(findUser, 1)

			io.emit('user writing', usersWriting)
		})
	})
}

export default io