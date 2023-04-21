import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

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

export const parseSessionUser = (user: any) => {
	const { id, userType, email, name } = user

	const token = createToken({
		id,
		userType
	})

	return {
		email,
		name,
		userType,
		token
	}
}

export const createURL = (page: number) => {
	return `/api/products?page=${page}`
}