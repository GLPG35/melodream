import { NextFunction, Request, Response } from 'express'

export const default404 = (_req: Request, res: Response) => {
	return res.status(404).end()
}

export const checkToken = (req: Request, _res: Response, next: NextFunction) => {
	if (req && req.cookies) {
		req.token = req.cookies['jwtToken']
	}

	return next()
}

export const checkOrderToken = (req: Request, _res: Response, next: NextFunction) => {
	if (req && req.cookies) {
		req.token = req.cookies['orderToken']
	}

	return next()
}