import { Document, Schema, model } from 'mongoose'

interface UserDocument extends Document {
	email: string,
	name: string,
	passwordHash?: string,
	userType: 'admin' | 'superstar' | 'user',
	cart: string,
	documentation: { id: number, name: string, url: string, approved?: boolean }[],
	pic: string,
	lastConnection: Date
}

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
		enum: ['admin', 'superstar', 'user'],
		required: true
	},
	cart: {
		type: Schema.Types.ObjectId,
		ref: 'Cart',
		required: true
	},
	documentation: [{
		id: Number,
		name: { type: String, enum: ['ID', 'Proof of Address', 'Bank Statement'] },
		url: String,
		approved: Boolean
	}],
	pic: String,
	lastConnection: Date
})

userSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

const User = model<UserDocument>('User', userSchema)

export default User