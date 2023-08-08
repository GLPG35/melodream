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

export const uploadImages = (images: {id: number, thumb: File}[]) => {
	return Promise.all(
		images.map(({ thumb }) => {
			const formData = new FormData()
			formData.append('thumb', thumb)

			return new Promise((res, rej) => {
				return fetch('/api/image/upload', {
					method: 'POST',
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
	(getAll: boolean): Promise<any>,
	(body: {}, method: Method): Promise<any>,
	(id: string, method: Method): Promise<any>,
	(id: string, body: {}, method: Method): Promise<any>
}

export const manageProduct: ManageProduct = (id?: string | {}, body?: any, method?: string) => {
	const options: RequestInit = {
		method: method || 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}

	if (typeof body !== 'object') {
		options.method = body
	}

	if (['POST', 'PUT'].includes(options.method as string)) {
		options.body = JSON.stringify(typeof id !== 'string' ? id : body)
	}

	return fetch(`/api/products/${typeof id == 'string' ? id : typeof id == 'boolean' ? `?getAll=${id}` : ''}`, options)
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

export const queryProduct = (field: string, value: string) => {
	return fetch(`/api/products?query[${field}]=${value}`)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res)
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

export const changeProductQtty = (cid: string, pid: string, type: 'sub' | 'add') => {
	const bQtty = type == 'add'
	const quantity = bQtty ? 1 : -1
	
	const options: RequestInit = {
		method: 'POST',
		body: JSON.stringify({
			quantity
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	}

	return fetch(`/api/carts/${cid}/product/${pid}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				return res.message
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

type ManageCategory = {
	(): Promise<any>,
	(body: { name: string }): Promise<any>,
	(cid: string, method: Method): Promise<any>
}

export const manageCategory: ManageCategory = (body?: { name: string } | string, method?: Method) => {
	const options: RequestInit = {
		method: body ? method || 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}

	if (method == 'POST') {
		options.body = JSON.stringify(body)
	}
	
	return fetch(`/api/categories`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res)
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
	(cid: string, pid: string, body: {}, method?: Method): Promise<any>,
	(cid: string, count: boolean): Promise<any>
}

export const manageCart: ManageCart = (cid?: string, pid?: string | boolean, body?: {}, method?: Method) => {
	const options: RequestInit = { method: method || ((body || !cid) ? 'POST' : 'GET') }

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
		userType?: 'admin' | 'user',
		cart?: string
	}): Promise<any>,
	(logout: true): Promise<any>
}

export const manageCartTotal = (cid: string) => {
	return fetch(`/api/carts/${cid}/total`)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				return res.message
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const checkCartProduct = (cid: string, pid: string) => {
	return fetch(`/api/carts/${cid}/product/check/${pid}`)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				return res.message
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const manageUser: ManageUser = (body?: { email: string, name?: string, password: string, userType?: 'admin' | 'user' } | true) => {
	const options: RequestInit = {
		method: body ? 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/json'
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

export const refreshUser = () => {
	const options: RequestInit = {
		method: 'GET',
		credentials: 'include'
	}

	return fetch('/api/login?refresh=true', options)
	.then(res => {
		if (res.ok) return res.json().then(res => res.message)

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const manageSearch = (text: string) => {
	const body = {
		text
	}

	return fetch('/api/products/search', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => {
		if (res.ok) return res.json().then(res => res)

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

type ManageOrder = {
	(email: string): Promise<any>,
	(email: string, oid: string): Promise<any>,
	(cid: string, email: string, userInfo: { phone: number, street: string }): Promise<any>
}

export const manageOrder: ManageOrder = (cid?: string, email?: string, userInfo?: { phone: number, street: string }) => {
	const options: RequestInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}

	if (userInfo) {
		options.method = 'POST'
		options.body = JSON.stringify({
			cid,
			email,
			userInfo
		})
	}

	return fetch(`/api/orders${!userInfo ? `/user/${cid}` : ''}
	${!userInfo && email ? `/${email}` : ''}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const verifyPaymentToken = () => {
	const options: RequestInit = {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'GET'
	}
	
	return fetch('/api/orders/token', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const recoverPassword = (email: string) => {
	const options: RequestInit = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			email
		})
	}

	return fetch('/api/login/recover', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const checkResetPassword = (token: string) => {
	const options: RequestInit = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'GET'
	}

	return fetch(`/api/login/reset/${token}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const resetPassword = (password: string, token: string) =>  {
	const options: RequestInit = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			password
		})
	}

	return fetch(`/api/login/reset/${token}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const manageSuperstar = (email: string) => {
	const options: RequestInit = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			email
		})
	}

	return fetch('/api/superstar', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const manageSnippets = (method: string, url: string, headers: any, postData: any) => {
	const options: RequestInit = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			method,
			url,
			headers,
			postData
		})
	}

	return fetch('/api/snippets', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const manageProfilePic = (file: File) => {
	const formData = new FormData()
	formData.append('thumb', file)

	return fetch('/api/image/upload?type=pfp', {
		method: 'POST',
		body: formData,
		credentials: 'include'
	}).then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				const { path } = res

				return fetch('/api/profile', {
					method: 'POST',
					body: JSON.stringify({
						path
					}),
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(res => {
					if (res.ok) {
						return res.json()
						.then(res => res.message)
					}
					
					return res.json()
					.then(res => {
						throw new Error(res.message)
					})
				})
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

type ManageDocs = {
	(): Promise<any>,
	(id: number, url: string): Promise<any>
}

export const manageDocs: ManageDocs = (id?: number, url?: string) => {
	const options: RequestInit = {
		method: id ? 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}

	if (id) {
		options.body = JSON.stringify({ id, url })
	}

	return fetch('/api/documentation', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => {
				if (id) return res.message

				return res.documentation
			})
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const uploadDoc = (file: File) => {
	const formData = new FormData()
	formData.append('thumb', file)

	return fetch('/api/image/upload?type=doc', {
		method: 'POST',
		body: formData,
		credentials: 'include'
	}).then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.path)
		}

		return res.json()
		.then(res => {
			throw new Error(res.message)
		})
	})
}

export const manageUsersWithDocs = () => {
	return fetch('/api/users/docs')
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res)
		}

		return res.json()
		.then(err => {
			throw new Error(err.message)
		})
	})
}

export const manageUserDoc = (email: string, id: number, approve: boolean) => {
	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			id,
			email
		})
	}
	
	return fetch(`/api/documentation/${approve ? 'approve' : 'reject'}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(err => {
			throw new Error(err.message)
		})
	})
}

export const manageUsers = () => {
	const options: RequestInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}

	return fetch('/api/users', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res)
		}

		return res.json()
		.then(err => {
			throw new Error(err.message)
		})
	})
}

export const deleteUsers = (users: string[]) => {
	const options: RequestInit = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			users
		})
	}

	return fetch('/api/users', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(err => {
			throw new Error(err.message)
		})
	})
}

export const deleteInactiveUsers = () => {
	const options: RequestInit = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}

	return fetch('/api/users/inactive', options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(err => {
			throw new Error(err.message)
		})
	})
}

export const updateUser = (uid: string, user: { name: string, userType: string }) => {
	const options: RequestInit = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(user)
	}

	return fetch(`/api/users/${uid}`, options)
	.then(res => {
		if (res.ok) {
			return res.json()
			.then(res => res.message)
		}

		return res.json()
		.then(err => {
			throw new Error(err.message)
		})
	})
}