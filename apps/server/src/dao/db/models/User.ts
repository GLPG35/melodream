import { Schema, model } from 'mongoose'

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	passwordHash: String,
	userType: {
		type: String,
		enum: ['admin', 'user'],
		required: true
	}
})

userSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

const User = model('User', userSchema)

export default User