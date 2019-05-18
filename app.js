// Full Documentation - https://www.turbo360.co/docs
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const controllers = require('./controllers')

const APIRouter = vertex.APIRouter
const api = new APIRouter({
	site_id: process.env.TURBO_APP_ID,
	api_key: process.env.TURBO_API_KEY,
	env: process.env.TURBO_ENV
})

const config = {
	views: 'views', 	// Set views directory
	static: 'public', // Set static assets directory. , css js etc, images
	db: vertex.nedbConfig((process.env.TURBO_ENV=='dev') ? 'nedb://'+path.join(__dirname, process.env.TMP_DIR) : 'nedb://'+process.env.TMP_DIR)
}

const app = vertex.app(config) // initialize app with config options

// import routes
const index = require('./routes/index')

// set routes
app.use('/', index)
app.use('/api', api.router(controllers))


module.exports = app
