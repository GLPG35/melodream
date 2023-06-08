import { Router } from 'express'

const router = Router()

router.get('/debug', (req, res) => {
	req.logger.debug('Debug')

	res.send({ success: true, message: 'Debug logger test' })
})

router.get('/http', (req, res) => {
	req.logger.debug('HTTP')

	res.send({ success: true, message: 'HTTP logger test' })
})

router.get('/info', (req, res) => {
	req.logger.info('Info')

	res.send({ success: true, message: 'Info logger test' })
})

router.get('/warn', (req, res) => {
	req.logger.warning('Warn!')

	res.send({ success: true, message: 'Warn logger test' })
})

router.get('/error', (req, res) => {
	req.logger.error('Error')

	res.send({ success: true, message: 'Error logger test' })
})

router.get('/fatal', (req, res) => {
	req.logger.fatal('Fatal')

	res.send({ success: true, message: 'Fatal logger test' })
})

export default router