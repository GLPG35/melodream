import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
	uid: Number,
	name: String,
	message: String
}, { timestamps: true })

messageSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Message = model('Message', messageSchema)

export default Message