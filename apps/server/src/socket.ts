import { Server } from 'socket.io'
import http from 'http'
import * as fs from 'fs/promises'

const io = (httpServer: http.Server) => {
	const io = new Server(httpServer, {
		cors: {
			origin: '*'
		}
	})
	
	io.on('connection', socket => {
		socket.on('add message', async msgData => {
			const messages = await fs.readFile(__dirname + '/public/messages.json', 'utf-8')
				.then((data: any) => JSON.parse(data))
				.catch(() => [])
	
			messages.push(msgData)
	
			io.emit('new message', msgData)
	
			fs.writeFile(__dirname + '/public/messages.json', JSON.stringify(messages, null, '\t'), 'utf-8')
			.catch(console.error)
		})
	})
}

export default io