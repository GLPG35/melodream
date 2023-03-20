import { Server } from 'socket.io'
import http from 'http'
import Message from './dao/db/models/Message'
import ProductManager from './dao/db/productManager'

const io = (httpServer: http.Server) => {
	const io = new Server(httpServer, {
		cors: {
			origin: '*'
		}
	})

	const usersWriting: {uid: number, user: string}[] = []
	
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
				io.emit('new message', msgData)

				Message.create(msgData)
				.catch(err => {
					console.error(err.message)
				})
			}
		})

		// Check if user is writing
		socket.on('start writing', ({ uid, user }) => {
			const findUser = usersWriting.find(x => x.uid == uid)
			
			if (!findUser) usersWriting.push({uid: +uid, user})

			io.emit('user writing', usersWriting)

			const endWriting = () => {
				const findUser = usersWriting.findIndex(x => x.uid == uid)

				if (findUser != -1) usersWriting.splice(findUser, 1)

				io.emit('user writing', usersWriting)
			}
			
			debounce(endWriting, 3000)
		})

		socket.on('end writing', uid => {
			const findUser = usersWriting.findIndex(x => x.uid == uid)

			if (findUser != -1) usersWriting.splice(findUser, 1)

			io.emit('user writing', usersWriting)
		})

		//For realtimeproducts
		const products = new ProductManager()

		socket.on('add product', product => {
			products.addProduct(product)
			.then(() => {
				products.getProducts()
				.then(resProducts => {
					io.emit('product added', resProducts.reverse())
				})
			}).catch(err => {
				io.emit('product error', err.message)
			})
		})
	})
}

export default io