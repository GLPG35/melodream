import { Document, PopulatedDoc, Schema, model } from 'mongoose'
import { PopulatedCartProduct } from '../../../types'

export interface CartDocument extends Document {
	products: [{
		product: string,
		quantity: number
	}]
}

export interface PopulatedCartDocument extends PopulatedDoc<Document> {
	products: [{
		product: PopulatedCartProduct,
		quantity: number
	}],
	count?: number
}

const cartSchema = new Schema({
	products: [{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		quantity: { type: Number, required: true }
	}]
})

cartSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Cart = model<CartDocument>('Cart', cartSchema)

export default Cart