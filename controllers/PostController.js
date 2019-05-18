const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Post = require('../models/Post')
const utils = require('./utils')

module.exports = {
	collectionName: () => {
		return Post.collectionName()
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Post.collectionName(), turbo)
			.then(data => {
				return Post.find(params, utils.parseFilters(params))
			})
			.then(posts => {
				resolve(Post.convertToJson(posts))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Post.collectionName(), turbo)
			.then(data => {
				return Post.findById(id)
			})
			.then(post => {
				if (post == null){
					throw new Error(Post.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(post.summary())
			})
			.catch(err => {
				reject(new Error(Post.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null

			if (body.text != null)
				body['preview'] = utils.scrapePreview(body.text, 200)

			if (body.title != null)
				body['slug'] = utils.slugVersion(body.title, 6)

			body['dateString'] = utils.formattedDate('MMMM Do, YYYY')

			Post.create(body)
			.then(post => {
				payload = post.summary()
				return utils.syncCollection(Post.collectionName(), turbo)
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

			if (params.text != null)
				params['preview'] = utils.scrapePreview(params.text, 200)

			Post.findByIdAndUpdate(id, params, {new:true})
			.then(post => {
				payload = post.summary()
				return utils.syncCollection(Post.collectionName(), turbo)
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
			Post.findByIdAndRemove(id)
			.then(() => {
				return utils.syncCollection(Post.collectionName(), turbo)
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
