import { expect } from 'chai'
import supertest from 'supertest'

const requester = supertest('http://localhost:3000')

describe('Testing users', () => {
	let cookie: string

	// it('Should register a new user', async () => {
	// 	const newUser = {
	// 		email: 'test2@gmail.com',
	// 		name: 'Test 2',
	// 		password: 'test'
	// 	}

	// 	const { ok, body, headers: { 'set-cookie': cookies } } = await requester.post('/api/register').send(newUser)
	// 	cookie = cookies[0]
	// 	const [cookieName, cookieValue] = cookie.split('=')

	// 	expect(cookieName).to.be.ok.and.eql('jwtToken')
	// 	expect(cookieValue).to.be.ok
	// 	expect(ok).to.be.true
	// 	expect(body.success).to.be.true
	// })

	it('Should login the new user and retrieve cookie', async () => {
		const newUser = {
			email: 'test2@gmail.com',
			password: 'test'
		}

		const { ok, body, headers: { 'set-cookie': cookies } } = await requester.post('/api/login').send(newUser)
		cookie = cookies[0]
		const [cookieName, cookieValue] = cookie.split('=')

		expect(cookieName).to.be.ok.and.eql('jwtToken')
		expect(cookieValue).to.be.ok
		expect(ok).to.be.true
		expect(body.success).to.be.true
	})

	it('Should get the active user with the preserved cookie', async () => {
		const { ok, body } = await requester.get('/api/login').set('Cookie', cookie)

		expect(ok).to.be.true
		expect(body.success).to.be.true
		expect(body.message).to.have.property('email').eql('test2@gmail.com')
	})

	// it('Should send an email to recover the password', async () => {
	// 	const user = {
	// 		email: 'test2@gmail.com'
	// 	}

	// 	const { ok, body } = await requester.post('/api/login/recover').send(user)

	// 	expect(ok).to.be.true
	// 	expect(body.success).to.be.true
	// })

	it('Should logout successfully', async () => {
		const { ok, body } = await requester.post('/api/logout').set('Cookie', cookie)

		expect(ok).to.be.true
		expect(body.success).to.be.true
	})
})