import { Document, Schema, model } from 'mongoose'

interface OrderDocument extends Document {
	amount: number,
	products: [{
		product: string,
		quantity: number
	}],
	user: string,
	userInfo: {
		phone: number,
		street: string
	}
}

const orderSchema = new Schema({
	amount: Number,
	products: [{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		quantity: { type: Number, required: true }
	}],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	userInfo: {
		phone: Number,
		street: String
	}
}, { timestamps: true })

orderSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Order = model<OrderDocument>('Order', orderSchema)

export default Order