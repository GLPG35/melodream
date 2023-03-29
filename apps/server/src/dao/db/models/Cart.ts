import { Schema, model } from 'mongoose'

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

const Cart = model('Cart', cartSchema)

export default Cart