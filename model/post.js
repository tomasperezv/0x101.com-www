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

Post.prototype.getPosts = function(position, callback) {

	var self = this;

	this.load({}, function(model) {

		// Get the content of the post
		var firstPost = model.data.length > 0 ? model.data[0].content : '';

		// Determine the total number of posts
		self.count( function(count) {
			callback({
				count: count,
				post: firstPost
			});
		});

	}, 1, {column:'date',type:'desc'}, position);

}

exports.Post = Post;
