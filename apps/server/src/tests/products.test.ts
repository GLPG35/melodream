import { expect } from 'chai'
import supertest from 'supertest'

const requester = supertest('http://localhost:3000')

describe('Testing products', () => {
	let cookie: string

	before(async () => {
		const testUser = {
			email: 'test@gmail.com',
			password: 'test'
		}

		const { headers: { 'set-cookie': cookies } } = await requester.post('/api/login').send(testUser)
		cookie = cookies[0]
		const [cookieName, cookieValue] = cookie.split('=')

		expect(cookieName).to.be.ok.and.eql('jwtToken')
		expect(cookieValue).to.be.ok
	})

	it('Should get last 10 products from the database', async () => {
		const { ok, body } = await requester.get('/api/products')

		expect(ok).to.be.true
		expect(body).to.have.property('docs')
	})

	it('Should add a new product to the database', async () => {
		const newProduct = {
			code: 'test',
			title: 'Test product',
			price: 129,
			thumbnails: [
				'/static/images/1bf9f1b05263dd714d0dd1ebffb17941.jpg'
			],
			description: 'Test description',
			stock: 3,
			category: '645adceb7def69a63dac39ca', //K-Pop
			subCategory: 'Modern Generation'
		}

		const { ok, body } = await requester.post('/api/products').set('Cookie', cookie).send(newProduct)

		//Product already exists
		expect(ok).to.be.false
		expect(body.success).to.be.false
	})

	it('Should update the test product to a new name', async () => {
		const testProductId = '64adb7f35f87233790b3a458'
		const updateProduct = {
			title: `Test Product (${Date.now().toString()})`
		}

		const { ok, body } = await requester.put(`/api/products/${testProductId}`).set('Cookie', cookie).send(updateProduct)

		expect(ok).to.be.true
		expect(body.success).to.be.true
	})
})