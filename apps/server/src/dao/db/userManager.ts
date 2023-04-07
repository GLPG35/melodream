import { User as UserType } from '../../types'
import bcrypt from 'bcrypt'
import User from './models/User'

class UserManager {
	addUser = async (user: UserType) => {
		const { email, name, password, userType } = user

		const passwordHash = await bcrypt.hash(password, 10)

		return User.create({
			email,
			name,
			passwordHash,
			userType: userType || 'user'
		})
	}

	authUser = (email: string, password: string) => {
		return User.findOne({ email })
		.then(async user => {
			if (!user) throw new Error('Invalid user or password')

			const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

			if (!passwordCorrect) throw new Error('Invalid user or password')

			return user	
		})
	}
}

export default UserManager