import winston from 'winston'
import { Request, Response, NextFunction } from 'express'
import { __root } from '../paths'

const options = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5
	},
	colors: {
		fatal: 'red',
		error: 'red',
		warning: 'yellow',
		info: 'blue',
		http: 'white',
		debug: 'white'
	}
}

export const logger = winston.createLogger({
	levels: options.levels,
	transports: [
		new winston.transports.Console({
			level: process.env.NODE_ENV ? 'info' : 'debug',
			format: winston.format.combine(
				winston.format.colorize({ colors: options.colors }),
				winston.format.simple()
			)
		}),
		new winston.transports.File({
			filename: __root + '/logs/errors.log',
			level: 'error',
			format: winston.format.simple()
		})
	]
})

export const addLogger = (req: Request, _res: Response, next: NextFunction) => {
	req.logger = logger
	req.logger.info(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`)

	next()
}