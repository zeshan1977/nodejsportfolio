const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const School = require('../models/School')
const utils = require('./utils')

module.exports = {
	collectionName: () => {
		return School.collectionName()
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(School.collectionName(), turbo)
			.then(data => {
				return School.find(params, utils.parseFilters(params))
			})
			.then(schools => {
				resolve(School.convertToJson(schools))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(School.collectionName(), turbo)
			.then(data => {
				return School.findById(id)
			})
			.then(school => {
				if (school == null){
					throw new Error(School.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(school.summary())
			})
			.catch(err => {
				reject(new Error(School.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = utils.formattedDate('MMMM Do, YYYY')

			School.create(body)
			.then(school => {
				payload = school.summary()
				return utils.syncCollection(School.collectionName(), turbo)
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
			School.findByIdAndUpdate(id, params, {new:true})
			.then(school => {
				payload = school.summary()
				return utils.syncCollection(School.collectionName(), turbo)
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
			School.findByIdAndRemove(id)
			.then(() => {
				return utils.syncCollection(School.collectionName(), turbo)
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
