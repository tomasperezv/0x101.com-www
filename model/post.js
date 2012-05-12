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
	basedir = Setup.serverDirectory;

var DataBaseModel = require('../' + basedir + '/model/database-model');

Post = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'posts';

}

Post.prototype = new DataBaseModel.DataBaseModel(); 

Post.prototype.getPosts = function(filters, callback) {

	var self = this,
		position = filters.position;

	this.load({category: filters.category, slug: filters.slug}, function(model) {

		// Get the content of the post
		var firstPost = category = label = date = '';

		if (model.data.length > 0) {
			firstPost = model.data[0].content;
			category = model.data[0].category;
			label = model.data[0].slug;
			date = model.data[0].date;
		}

		// Determine the total number of posts
		self.count({category: filters.category, slug: filters.slug}, function(count) {
			callback({
				count: count,
				post: firstPost,
				category: category,
				label: label,
				date: date
			});
		});

	}, 1, {column:'date',type:'desc'}, position);

}

exports.Post = Post;
