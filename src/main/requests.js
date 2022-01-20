import axios from 'axios'

import database from '@/src/main/database'

const PRODUCTS_URL = 'http://localhost:3000/products'
const CART_URL = 'http://localhost:3001/cart'

export async function* improveProductInfos() {
	const products = await database()

	for (const product of products) {
		const { data: productInfo } = await axios.get(PRODUCTS_URL, { params: { product_name: product } })
		const { data: cartData } = await axios.post(CART_URL, { id: productInfo?.product?.id })

		yield cartData
	}
}
