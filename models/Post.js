/*
  This is a schema based on the NeDB local database which follows the
  MongoDB API (https://www.npmjs.com/package/nedb). The 'camo' library
  is an ORM for the NeDB implementation.

  Eventually, this should be replaced by a MONGOOSE schema when used in
  conjunction with Mongo DB. This would happen in the case of a
  developer taking over the project.
*/


// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
	title: {type:String, default:''},
	preview: {type:String, default:''},
	tags: {type:Array, default:[]},
	text: {type:String, default:''},
	image: {type:String, default:''},
	slug: {type:String, default:''},
	link: {type:String, default:''},
	type: {type:String, default:''}, // original or link
	numReplies: {type:Number, default:0},
	isPublic: {type:String, default:'no'},
	dateString: {type:String, default:''},
	schema: {type:String, default:'post'},
	dateString: {type:String, default:''},
	timestamp: {type:Date, default: new Date()}
}

class Post extends Document {
	constructor(){
		super()
		this.schema(props)
	}

	summary(){
		const summary = {id: this._id}
		Object.keys(props).forEach(prop => {
			summary[prop] = this[prop] || props[prop].default
		})

		return summary
	}

	static get resourceName(){
		return 'post'
	}

	static collectionName(){
			return 'posts'
	}

	static convertToJson(posts){
		return posts.map(post => {
			return post.summary()
		})
	}

	/*
		the following static methods are implemented to mirror the
		Mongoose ORM methods, such that if you port this over to MongoDB,
		there should be no need to change the controller functions
	*/

	static create(params){
		const instance = new Post()
		Object.keys(props).forEach(prop => {
			instance[prop] = params[prop] || props[prop].default
		})

		instance['timestamp'] = new Date()
		return instance.save()
	}

	static findById(id){
		return Post.findOne({_id: id})
	}

	static findByIdAndUpdate(id, params){
		return Post.findOneAndUpdate({_id:id}, params, {upsert:true})
	}

	static findByIdAndRemove(id){
		return Post.findOneAndDelete({_id:id})
	}
}

module.exports = Post
