/**
 * Object model for the table posts
 *
 * create table posts(
 * 	id int not null,
 * 	date int,
 *	text string,
 * 	PRIMARY KEY(id)
 * );
 */
var Setup = require('../setup.js'),
	basedir = Setup.serverDirectory,
	DataBaseModel = require('../' + basedir + '/model/database-model'),
	DataBaseFormat = require('../' + basedir + '/database/database-format');

Post = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'posts';

}

Post.prototype = new DataBaseModel.DataBaseModel(); 

Post.prototype.getPosts = function(filters, callback) {

	var self = this;

	this.load({position: filters.position, category: filters.category, slug: filters.slug}, function(model) {

		// Get the content of the post
		var firstPost = category = label = date = '';

		if (model.data.length > 0) {
			firstPost = model.data[0].content;
			category = model.data[0].category;
			label = model.data[0].slug;
			date = model.data[0].date;
			position = model.data[0].position;
		}

		// Determine the total number of posts
		self.count({}, function(count) {
			// Identify the position of the post
			callback({
				count: count,
				post: firstPost,
				category: category,
				position: position,
				label: label,
				date: DataBaseFormat.toDate(date)
			});
		});

	}, 1, {column:'position',type:'desc'});

}

exports.Post = Post;
