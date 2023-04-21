export const convertImage = (img: HTMLImageElement, name: string): Promise<File> | undefined => {
	URL.revokeObjectURL(img.src)

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	canvas.width = img.width > img.height ? img.width : img.height
	canvas.height = canvas.width

	if (context) {
		context.drawImage(img,
			img.width < img.height ? canvas.width / 2 - img.width / 2 : 0,
			img.height < img.width ? canvas.height / 2 - img.height / 2 : 0
		)
		
		context.globalCompositeOperation = 'destination-over'
		context.fillStyle = '#ffffff'
		context.fillRect(0, 0, canvas.width, canvas.width)

		return new Promise((res, rej) => {
			canvas.toBlob(blob => {
				if (blob) {
					const newThumb = new File([blob], name)

					res(newThumb)
				}

				rej('Error to convert')
			}, 'image/jpeg', 0.6)
		})
	}

	return undefined
}

export const uploadImages = (images: {id: number, thumb: File}[], token: string) => {
	return Promise.all(
		images.map(({ thumb }) => {
			const formData = new FormData()
			formData.append('thumb', thumb)

			return new Promise((res, rej) => {
				return fetch('/api/image/upload', {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: formData
				}).then(res => {
					if (res.ok) {
						return res.json()
						.then(res => res)
					}

					return res.json()
					.then(res => {
						throw new Error(res.message)
					})
				}).then(({ path }) => {
					return res(path)
				}).catch(err => {
					console.log(err.message)
					return rej(err)
				})
			})
		})
	)
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ManageProduct = {
	(): Promise<any>
	(id: string): Promise<any>,
	(body: {}, method: Method, token: string): Promise<any>,
	(id: string, method: Method, token: string): Promise<any>,
	(id: string, body: {}, method: Method, token: string): Promise<any>
}

const methodDict = ['GET', 'POST', 'PUT', 'DELETE']

export const manageProduct: ManageProduct = (id?: string | {}, body?: any, method?: string, token?: string) => {
	const methodIsToken = () => {
		if (token) return false

		return methodDict.map(x => method !== x).every(x => x)
	}

	const options: RequestInit = {
		method: method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${methodIsToken() ? method : token}`
		},
		credentials: 'include'
	}

	if (typeof body !== 'object') {
		options.method = body
	}

	if (options.method == 'POST' || options.method == 'PUT') {
		options.body = JSON.stringify(typeof id !== 'string' ? id : body)
	}

	return fetch(`/api/products/${typeof id !== 'string' ? '' : id}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				return res
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const productsPage = (page: number) => {
	return fetch(`/api/products?page=${page}`)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				return res
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

type ManageCart = {
	(): Promise<any>,
	(cid: string): Promise<any>,
	(cid: string, pid: string, body: {}): Promise<any>,
	(cid: string, count: boolean): Promise<any>
}

export const manageCart: ManageCart = (cid?: string, pid?: string | boolean, body?: {}) => {
	const options: { method: 'POST' | 'GET', headers?: {}, body?: string } = { method: (body || !cid) ? 'POST' : 'GET' }

	if (options.method == 'POST') {
		options.headers = { 'Content-Type': 'application/json' }
		options.body = JSON.stringify(body)
	}

	return fetch(`/api/carts/${cid || ''}
	${typeof pid === 'boolean' ? '?count=true' : ''}
	${typeof pid == 'string' ? `/product/${pid}` : ''}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				return res
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

type ManageUser = {
	(): Promise<any>,
	(body: {
		email: string,
		name?: string,
		password: string,
		userType?: 'admin' | 'user'
	}, token?: string): Promise<any>,
	(logout: true): Promise<any>
}

export const manageUser: ManageUser = (body?: { email: string, name?: string, password: string, userType?: 'admin' | 'user' } | true, token?: string) => {
	const options: RequestInit = {
		method: body ? 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(token) && { 'Authorization': `Bearer ${token}` }
		},
		credentials: 'include'
	}

	if (body !== true && options.method == 'POST') {
		options.body = JSON.stringify(body)
	}

	return fetch(body === true ? '/api/logout' : `/api/${(body && body.name) ? 'register' : 'login'}`, options)
	.then(res => {
		if (res.ok) return res.json().then(res => res.message)

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}