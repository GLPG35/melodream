import Category from './models/Category'

class CategoryManager {
	addCategory = (name: string) => {
		return Category.create({ name })
	}

	getCategories = () => {
		return Category.find({ status: true })
	}

	deleteCategory = (id: string) => {
		return Category.findByIdAndUpdate(id, { status: false })
	}
}

export default CategoryManager