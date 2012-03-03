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
var basedir = __dirname + '/../../blackbriar/server';
var DataBaseModel = require(basedir + '/model/database-model');

Post = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'posts';

}

Post.prototype = new DataBaseModel.DataBaseModel(); 

exports.Post = Post;
