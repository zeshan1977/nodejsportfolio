// Full Documentation - https://docs.turbo360.co/
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const controllers = require('../controllers')

const CDN = (process.env.TURBO_ENV=='dev') ? null : process.env.CDN

router.get('/', (req, res) => {
	const format = req.query.format || 'render' // 'json' or 'render'
	const data = {
		cdn: CDN
	}

	turbo.pageConfig('home', process.env.TURBO_API_KEY, process.env.TURBO_ENV)
	.then(homeConfig => {
		data['page'] = homeConfig
		return turbo.currentApp(process.env.TURBO_ENV)
	})
	.then(site => {
		data['site'] = site
		data['global'] = site.globalConfig

		if (format == 'json')
			res.json(data)
		else
			res.render('index', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

module.exports = router
