import { Router } from 'express'
import { HTTPSnippet } from 'httpsnippet'
import { CustomError } from '../../utils'

const router = Router()

router.post('/', (req, res, next) => {
	const { method, url, headers, postData } = req.body

	const snippet: any = new HTTPSnippet({
		method,
		url: `http://localhost:3000${url}`
	} as any)

	if (headers) snippet.headers = headers
	if (postData) snippet.postData = postData

	const options = [
		{
			target: 'shell',
			client: 'curl',
			name: 'curl'
		},
		{
			target: 'javascript',
			client: 'fetch',
			name: 'javascript'
		}
	]	

	try {
		const convert = options.map(({ target, client, name }) => {
			return {
				snippet: snippet.convert(target as any, client, { indent: '\t', short: true }),
				name
			}
		})

		return res.send({ success: true, message: convert })
	} catch (err: any) {
		return next(new CustomError(err.message, 400))
	}
})

export default router