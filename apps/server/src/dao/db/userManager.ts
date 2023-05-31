import { AddUser } from '../../types'
import bcrypt from 'bcrypt'
import User from './models/User'
import CartManager from './cartManager'
import { CustomError } from '../../utils'

const carts = new CartManager()

class UserManager {
	addUser = async (user: AddUser) => {
		const { email, name, password, userType, cart } = user

		const passwordHash = await bcrypt.hash(password, 10)

		const checkCart = cart || await carts.addCart().then(cart => cart.id)

		return User.create({
			email,
			name,
			passwordHash,
			userType: userType || 'user',
			cart: checkCart
		})
	}

	addSocialUser = async (user: any) => {
		const { email, name, userType } = user

		if (!email) throw new CustomError('Public verified email address not defined on this Github account', 400)

		return User.create({
			email: email,
			name,
			userType
		})
	}

	authUser = (email: string, password: string) => {
		return User.findOne({ email })
		.then(async user => {
			if (!user) return null
			
			const passwordCorrect = await bcrypt.compare(password, user.passwordHash as string)

			if (!passwordCorrect) return null

			return user
		})
	}

	getUser = (email: string) => {
		return User.findOne({ email })
	}
}

export default UserManager