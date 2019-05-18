const path = require('path')
const cheerio = require('cheerio')
const moment = require('moment')
const LOCAL_DIR = path.join(__dirname, process.env.TMP_DIR).replace('controllers/', '')

module.exports = {
  checkCollectionDB: (collectionName, turbo) => {
    const localDirectory = path.join(__dirname, process.env.TMP_DIR).replace('/controllers', '')
  	const collectionFilePath = (process.env.TURBO_ENV=='dev') ? localDirectory+'/'+collectionName+'.db' : process.env.TMP_DIR+'/'+collectionName+'.db'

  	return new Promise((resolve, reject) => {
  		turbo.checkCollectionFile(collectionName, collectionFilePath)
  		.then(data => { // load collection file from backing store if necessary
  			return (data.found) ? null : turbo.loadCollection(collectionName, collectionFilePath, process.env.TURBO_API_KEY)
  		})
  		.then(data => {
  			resolve(data)
  		})
  		.catch(err => {
  			reject(err)
  		})
  	})
  },

  syncCollection: (collectionName, turbo) => {
    const filePath = (process.env.TURBO_ENV=='dev') ? LOCAL_DIR + '/'+collectionName+'.db' : process.env.TMP_DIR+'/'+collectionName+'.db'
  	return turbo.syncCollection(collectionName, filePath, process.env.TURBO_API_KEY)
  },

  slugVersion: (text, numRandomChars) => {
  	let slug = text.toString().toLowerCase()
  			.replace(/\s+/g, '-')           // Replace spaces with -
  			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
  			.replace(/^-+/, '')             // Trim - from start of text
  			.replace(/-+$/, '');            // Trim - from end of text

  	if (numRandomChars == null)
  		return slug.toLowerCase()

  	if (numRandomChars <= 0)
  		return slug.toLowerCase()

  	var randomString = ''
  	var possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  	for (var i=0; i <numRandomChars; i++)
  		randomString += possible.charAt(Math.floor(Math.random() * possible.length))

  	return slug.toLowerCase()+'-'+randomString
  },

  scrapePreview: (text, limit) => {
    $ = cheerio.load(text)
    let plainText = ''
    $('p').each((i, element) => {
      plainText += element.children[0].data
    })

    if (plainText.length >= limit)
      return plainText.substring(0, limit)+'...'

    return plainText
  },

  parseFilters: (params) => {
    if (params==null)
      return null

    const filters = {}
    filters['sort'] = (params.sort == 'asc') ? 'timestamp' : '-timestamp'
    delete params['sort']

    filters['limit'] = (params.limit) ? parseInt(params.limit) : 0
    delete params['limit']
    return filters
  },

  // human readable date
  formattedDate: (format) => {
    if (format == null)
      format = 'MMMM Do, YYYY'

    return moment().format(format)
  }
}
