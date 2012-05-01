/**
  * @author <tom@0x101.com>
  * @class TemplateEngine
  */
var Setup = require('./setup.js'),
	basedir = Setup.serverDirectory;

ServerCore = require(basedir + '/server-core'),
Post = require('./model/post').Post;

this.processData = function(config, callback) {
	return this.actions[config.action](callback);
};

this.blog = {
	index: function(callback) {

		var position = 0;

		var post = new Post(),
			templateParams = {
				position: position,
				title: 'blog.tomasperez.com',
				static_domain: ServerCore.staticDomain(),
				description: 'My personal blog',
				api_url: ServerCore.apiDomain(),
			};

		post.getPosts(position, function(postData) {
			// Add the extra info to the template params.
			templateParams.firstPost = postData.post;
			templateParams.count = postData.count;

			if (position > 0) {
				templateParams.hasNext = true;
				templateParams.next = position-1;
			}

			if ( (postData.count - position) > 0 ) {
				templateParams.hasPrev = true;
				templateParams.prev = position+1;
			}

			callback(templateParams);
		});

	}
};

this.admin = {
	index: function(callback) {
		callback({
			title: 'blog.tomasperez.com',
			static_domain: ServerCore.staticDomain(),
			api_url: ServerCore.apiDomain(),
			domain: 'tomasperez.com',
			description: 'Admin panel'
		});
	}
};

this.actions = {
	'blog.index': this.blog.index,
	'admin.index': this.admin.index
};
