const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Job = require('../models/Job')
const utils = require('./utils')

module.exports = {
	collectionName: () => {
		return Job.collectionName()
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Job.collectionName(), turbo)
			.then(data => {
				return Job.find(params, utils.parseFilters(params))
			})
			.then(jobs => {
				resolve(Job.convertToJson(jobs))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Job.collectionName(), turbo)
			.then(data => {
				return Job.findById(id)
			})
			.then(job => {
				if (job == null){
					throw new Error(Job.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(job.summary())
			})
			.catch(err => {
				reject(new Error(Job.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = utils.formattedDate('MMMM Do, YYYY')

			Job.create(body)
			.then(job => {
				payload = job.summary()
				return utils.syncCollection(Job.collectionName(), turbo)
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
			Job.findByIdAndUpdate(id, params, {new:true})
			.then(job => {
				payload = job.summary()
				return utils.syncCollection(Job.collectionName(), turbo)
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
			Job.findByIdAndRemove(id)
			.then(() => {
				return utils.syncCollection(Job.collectionName(), turbo)
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
