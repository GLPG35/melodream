import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request } from 'express'

dotenv.config()

export const createToken = (content: JwtPayload) => {
	return jwt.sign(content, process.env.SECRET as string, { expiresIn: '7d' })
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