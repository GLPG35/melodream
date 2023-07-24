import { AddUser } from '../../types'
import bcrypt from 'bcrypt'
import User from './models/User'
import { CustomError } from '../../utils'
import CartManager from './cartManager'

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

	resetPassword = async (email: string, newPassword: string) => {
		const passwordHash = await bcrypt.hash(newPassword, 10)

		return User.findOneAndUpdate({ email }, { passwordHash })
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

	getUsersDocs = () => {
		return User.find({ 'documentation.0': { $exists: true } })
	}

	getDocumentation = async (email: string) => {
		const user = await this.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		return user.documentation
	}

	addDocumentation = async (email: string, id: string, url: string) => {
		const user = await this.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		const docTypes = [
			{
				id: 1,
				name: 'ID'
			},
			{
				id: 2,
				name: 'Proof of Address'
			},
			{
				id: 3,
				name: 'Bank Statement'
			}
		]
		
		if (!docTypes.find(x => x.id == +id)) throw new CustomError('Incorrect id of document', 400)

		const { id: dId, name } = docTypes.find(x => x.id == +id) as { name: string, id: number }
		
		const findDoc = user.documentation.find(x => x.id == dId)

		if (findDoc) {
			return User.findOneAndUpdate({ email, 'documentation.id': id }, { $set: { 'documentation.$.url': url } }, { new: true })
		}
		
		const documentation = [...user.documentation, { id: dId, name, url }]

		return User.findOneAndUpdate({ email }, { documentation }, { new: true })
	}

	updateDocumentation = async (email: string, id: string, approved: boolean) => {
		const user = await this.getUser(email)

		if (!user) throw new CustomError('User not found', 404)
		
		return User.findOneAndUpdate({ email, 'documentation.id': id }, { $set: { 'documentation.$.approved': approved } }, { new: true })
		.then(doc => {
			if (!doc) throw new CustomError('Document not found', 404)

			return doc
		})
	}

	upgradeUser = async (email: string) => {
		const user = await this.getUser(email)

		if (!user) throw new CustomError('User not found', 404)
		if (user.userType !== 'user') throw new CustomError('User must be a normal member', 400)

		const documentation = await this.getDocumentation(email)
		if (documentation.length < 3 || !documentation.every(x => x.approved)) throw new CustomError('User must have the necessary documentation approved', 403)

		return User.findOneAndUpdate({ email }, { userType: 'superstar' }, { new: true })
	}

	updatePfp = async (email: string, url: string) => {
		const user = await this.getUser(email)

		if (!user) throw new CustomError('User not found', 404)
		
		return User.findOneAndUpdate({ email }, { pic: url }, { new: true })
	}

	updateLastConnection = async (email: string) => {
		const user = await this.getUser(email)

		if (!user) throw new CustomError('User not found', 404)

		return User.findOneAndUpdate({ email }, { lastConnection: Date.now() }, { new: true })
	}
}

export default UserManager