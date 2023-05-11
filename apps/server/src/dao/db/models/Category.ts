import { Schema, model } from 'mongoose'

const categorySchema = new Schema({
	name: String,
	status: { type: Boolean, default: true }
})

categorySchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject.status
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Category = model('Category', categorySchema)

export default Category