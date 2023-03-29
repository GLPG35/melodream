import { Schema, model, Document, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
	code: { type: String, unique: true },
	title: { type: String, index: 'text' },
	price: Number,
	thumbnails: [String],
	description: String,
	stock: Number,
	category: String,
	subCategory: String,
	status: Boolean
}, { timestamps: true })

productSchema.index({ title: 1, type: -1 })
productSchema.plugin(paginate)

productSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.status
	}
})

interface ProductDocument extends Document {}

const Product = model<ProductDocument, PaginateModel<ProductDocument>>('Product', productSchema)

export default Product