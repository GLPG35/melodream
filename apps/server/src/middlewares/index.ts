import { Request, Response } from 'express'

export const default404 = (_req: Request, res: Response) => {
	return res.status(404).end()
}