const JobController = require('./JobController')
const SchoolController = require('./SchoolController')
const PostController = require('./PostController')
const ReferenceController = require('./ReferenceController')

module.exports = {

	job: JobController,
	school: SchoolController,
	post: PostController,
	reference: ReferenceController

}
