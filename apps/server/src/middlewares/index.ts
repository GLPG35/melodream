import { NextFunction, Request, Response } from 'express'

export const default404 = (_req: Request, res: Response) => {
	return res.status(404).end()
}

export const checkToken = (req: Request, _res: Response, next: NextFunction) => {
	const { authorization } = req.headers

	if (authorization !== undefined && authorization.toLowerCase().startsWith('bearer')) {
		const bearerToken = authorization.split(' ')[1]

		req.token = bearerToken
	}

	return next()
}