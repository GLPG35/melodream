import { Schema, model, Document, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

interface ProductDocument extends Document {
	code: string,
	title: string,
	price: number,
	thumbnails: string[],
	description: string,
	stock: number,
	category: string,
	subCategory: string,
	status: boolean
}

const productSchema = new Schema({
	code: { type: String, unique: true },
	title: { type: String },
	price: Number,
	thumbnails: [String],
	description: String,
	stock: Number,
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	subCategory: String,
	status: Boolean
}, { timestamps: true })

productSchema.index({ title: 'text' }, { name: 'titleIndex' })
productSchema.plugin(paginate)

productSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.status
	}
})

const Product = model<ProductDocument, PaginateModel<ProductDocument>>('Product', productSchema)

export default Product