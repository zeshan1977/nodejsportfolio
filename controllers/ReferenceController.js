const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Reference = require('../models/Reference')
const utils = require('./utils')

module.exports = {
	collectionName: () => {
		return Reference.collectionName()
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Reference.collectionName(), turbo)
			.then(data => {
				return Reference.find(params, utils.parseFilters(params))
			})
			.then(references => {
				resolve(Reference.convertToJson(references))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Reference.collectionName(), turbo)
			.then(data => {
				return Reference.findById(id)
			})
			.then(reference => {
				if (reference == null){
					throw new Error(Reference.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(reference.summary())
			})
			.catch(err => {
				reject(new Error(Reference.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = utils.formattedDate('MMMM Do, YYYY')

			Reference.create(body)
			.then(reference => {
				payload = reference.summary()
				return utils.syncCollection(Reference.collectionName(), turbo)
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	put: (id, params) => {
		return new Promise((resolve, reject) => {
			let payload = null
			Reference.findByIdAndUpdate(id, params, {new:true})
			.then(reference => {
				payload = reference.summary()
				return utils.syncCollection(Reference.collectionName(), turbo)
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	delete: (id) => {
		return new Promise((resolve, reject) => {
			Reference.findByIdAndRemove(id)
			.then(() => {
				return utils.syncCollection(Reference.collectionName(), turbo)
			})
			.then(data => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}

}
