import { Schema, model } from 'mongoose'

const productSchema = new Schema({
	code: { type: String, unique: true },
	title: String,
	price: Number,
	thumbnails: [String],
	description: String,
	stock: Number,
	category: String,
	subCategory: String,
	status: Boolean
}, { timestamps: true })

productSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Product = model('Product', productSchema)

export default Product