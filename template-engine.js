/**
  * @author <tom@0x101.com>
  * @class TemplateEngine
  */
var Setup = require('./setup.js'),
	basedir = Setup.serverDirectory;

ServerCore = require(basedir + '/server-core'),
Post = require('./model/post').Post;

this.processData = function(config, slugInfo, callback) {
	return this.actions[config.action](callback, slugInfo);
};

this.blog = {
	index: function(callback, slugInfo) {

		if (slugInfo == null) {
			slugInfo = {};
		}

		slugInfo.position = 0;

		var post = new Post(),
			templateParams = {
				position: slugInfo.position,
				static_domain: ServerCore.staticDomain(),
				description: 'My personal blog',
				api_url: ServerCore.apiDomain(),
			};

		post.getPosts(slugInfo, function(postData) {
			// Add the extra info to the template params.
			templateParams.firstPost = postData.post;
			templateParams.count = postData.count;
			templateParams.category = postData.category;
			templateParams.label = postData.label;

			// 404
			if (postData.count == 0) {
				templateParams.noPosts = true;
			}

			if (slugInfo.position > 0) {
				templateParams.hasNext = true;
				templateParams.next = slugInfo.position-1;
			}

			if ( (postData.count - slugInfo.position) > 1 ) {
				templateParams.hasPrev = true;
				templateParams.prev = slugInfo.position+1;
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
