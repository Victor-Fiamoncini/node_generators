import { createServer } from 'http'
import { parse } from 'url'
import { v4 as uuid } from 'uuid'

import { improveProductInfos } from '@/src/main/requests'

const FIRST_SERVER_PORT = 3000
const SECOND_SERVER_PORT = 3001

async function firstServerHandler(req, res) {
	if (req.method === 'GET' && req.url.includes('products')) {
		const { query } = parse(req.url, true)

		if (query.product_name) {
			const product = {
				id: uuid(),
				name: query.product_name,
			}

			return res.end(JSON.stringify({ product }))
		}
	}

	return res.end('Unable to process request')
}

async function secondServerHandler(req, res) {
	if (req.method === 'POST' && req.url.includes('cart')) {
		for await (const productBuffer of req) {
			const product = JSON.parse(productBuffer)

			return res.end(`Process succeeded for ${product?.id}`)
		}
	}

	return res.end('Unable to process request')
}

async function main() {
	createServer(firstServerHandler).listen(FIRST_SERVER_PORT, () => {
		console.log(`First server running at: ${FIRST_SERVER_PORT}`)
	})

	createServer(secondServerHandler).listen(SECOND_SERVER_PORT, () => {
		console.log(`Second server running at: ${SECOND_SERVER_PORT}`)
	})

	for await (const data of improveProductInfos()) {
		console.table(data)
	}
}

main()
