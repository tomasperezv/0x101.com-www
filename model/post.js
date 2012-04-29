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

exports.Post = Post;
