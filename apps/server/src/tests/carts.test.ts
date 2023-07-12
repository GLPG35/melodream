import { expect } from 'chai'
import supertest from 'supertest'

const requester = supertest('http://localhost:3000')

describe('Testing carts', () => {
	let cart: string

	before(async () => {
		const { ok, body } = await requester.post('/api/carts')

		expect(ok).to.be.true
		expect(body.success).to.be.true
		
		cart = body.message
	})

	it('Should add a product to the cart and if exists, add quantity', async () => {
		const pid = '64adb7f35f87233790b3a458'

		const { ok, body } = await requester.post(`/api/carts/${cart}/product/${pid}`)

		expect(ok).to.be.true
		expect(body.success).to.be.true
	})

	it('Should get the contents of the selected cart', async () => {
		const { ok, body } = await requester.get(`/api/carts/${cart}`)

		expect(ok).to.be.true
		expect(body).to.have.property('id')
	})

	it('Should delete the selected cart', async () => {
		const { ok, body } = await requester.delete(`/api/carts/${cart}`)

		expect(ok).to.be.true
		expect(body.success).to.be.true
	})
})