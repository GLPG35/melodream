const socket = io()

const arrow = document.querySelector('.arrow')
const select = document.querySelector('select')

select.addEventListener('focus', () => {
	arrow.classList.add('active')
})

select.addEventListener('blur', () => {
	arrow.classList.remove('active')
})

let inputs = []

/**
@param {HTMLInputElement} input
*/
const checkInput = (input) => {
	const type = input.tagName
	const mapType = {
		'INPUT': '',
		'TEXTAREA': '',
		'SELECT': 'default'
	}

	const findInput = inputs.find(x => x.id == input.id)
	
	if (findInput) {
		const filteredInputs = inputs.filter(x => x.id !== input.id)
		inputs = filteredInputs
	}

	inputs.push({ id: input.id, state: input.value !== mapType[type] })

	if (inputs.length > 6) {
		document.querySelector('button[type="submit"]').disabled = !inputs.every(x => x.state)
	}
}

document.querySelectorAll('input').forEach(el => {
	el.addEventListener('input', e => checkInput(e.target))
})

document.querySelector('textarea').addEventListener('input', e => checkInput(e.target))
document.querySelector('select').addEventListener('input', e => checkInput(e.target))

document.querySelector('form').addEventListener('submit', e => {
	e.preventDefault()

	const {
		inputTitle: { value: title },
		code: { value: code },
		price: { value: price },
		stock: { value: stock },
		category,
		subCategory: { value: subCategory },
		description: { value: description }
	} = e.currentTarget

	const body = {
		title,
		code,
		price,
		stock,
		category: category.options[category.selectedIndex].text,
		subCategory,
		description
	}

	socket.emit('add product', body)
})

socket.on('product added', products => {
	const productsList = document.querySelector('.productsList')

	productsList.innerHTML = ''

	products.forEach(product => {
		productsList.insertAdjacentHTML('beforeend', `
			<div class="product">
				<div class="pic">
					<img src="${product.thumbnails[0]}" alt="">
				</div>
				<div class="info">
					<div class="title">
						${product.title}
					</div>
					<div class="extraInfo">
						<div class="price">
							<i class="ti ti-currency-dollar"></i> ${product.price}
						</div>
						<div class="stock">
							<i class="ti ti-package"></i> ${product.stock}
						</div>
					</div>
				</div>
			</div>
		`)
	})
})

socket.on('product error', msg => {
	console.error(msg)
})