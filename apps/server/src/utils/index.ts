import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request } from 'express'
import { faker } from '@faker-js/faker'

dotenv.config()

export class CustomError extends Error {
	status: number

	constructor(message: string, status: number) {
		super(message)
		this.status = status
	}
}

export const createToken = (content: JwtPayload) => {
	return jwt.sign(content, process.env.SECRET as string, { expiresIn: '2d' })
}

export const verifyToken = (token: string) => {
	try {
		const verifiedToken = jwt.verify(token, process.env.SECRET as string)

		return verifiedToken
	} catch (err) {
		return null
	}
}

export const oneTimeToken = (id: string) => {
	const content = {
		id: id
	}

	return jwt.sign(content, process.env.SECRET as string, { expiresIn: '15s' })
}

export const parseSessionUser = (user: any) => {
	const { userType, email, name, cart } = user

	const token = createToken({
		email,
		name,
		userType,
		cart
	})

	return {
		email,
		name,
		userType,
		cart,
		token
	}
}

export const cookieExtractor = (req: Request) => {
	if (req && req.cookies) {
		return req.cookies['jwtToken']
	}

	return null
}

export const createURL = (page: number) => {
	return `/api/products?page=${page}`
}

//Dev mode

export const generateUsers = (quantity: number) => {
	if (quantity < 0) throw new CustomError('Quantity must be greater than 0', 400)

	return Array.from({ length: quantity }, () => {
		return {
			id: faker.database.mongodbObjectId(),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			userType: faker.datatype.boolean() ? 'user' : 'admin',
			cart: faker.database.mongodbObjectId()
		}
	})
}

export const generateProducts = (quantity: number) => {
	if (quantity < 0) throw new CustomError('Quantity must be greater than 0', 400)

	return Array.from({ length: quantity }, () => {
		return {
			id: faker.database.mongodbObjectId(),
			code: faker.string.alphanumeric({ length: { min: 2, max: 6 } }),
			title: faker.commerce.productName(),
			price: faker.commerce.price(),
			thumbnails: [faker.image.url()],
			description: faker.commerce.productDescription(),
			stock: faker.number.int({ max: 999 }),
			category: faker.commerce.productMaterial(),
			subCategory: faker.commerce.productAdjective(),
			status: faker.datatype.boolean()
		}
	})
}