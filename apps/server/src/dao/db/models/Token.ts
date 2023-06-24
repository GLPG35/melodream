import { Schema, model } from 'mongoose'

const tokenSchema = new Schema({
	token: { type: String, required: true },
	email: { type: String, required: true }
})

tokenSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Token = model('Token', tokenSchema)

export default Token