/**
  * @author <tom@0x101.com>
  * @class Controller
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

		var post = new Post(),
			templateParams = {
				title: 'blog.tomasperez.com',
				static_domain: ServerCore.staticDomain(),
				api_url: ServerCore.apiDomain(),
			};

		post.getPosts(slugInfo, function(postData) {
			// Add the extra info to the template params.
			templateParams.firstPost = postData.post;
			templateParams.count = postData.count;
			templateParams.category = postData.category;
			templateParams.label = postData.label;
			templateParams.date = postData.date;

			// 404
			if (postData.count == 0) {
				templateParams.noPosts = true;
			}

			if (postData.position > 0) {
				templateParams.hasPrev = true;
				templateParams.prev = postData.position-1;
			}

			if ( (postData.count - postData.position) > 1 ) {
				templateParams.hasNext = true;
				templateParams.next = postData.position+1;
			}

			callback(templateParams);
		});

	}
};

this.admin = {
	index: function(callback) {
		callback({
			title: 'Admin panel',
			static_domain: ServerCore.staticDomain(),
			api_url: ServerCore.apiDomain(true),
			domain: 'tomasperez.com'
		});
	}
};

this.rss = {
	index: function(callback) {

		var posts = new Post();
		posts.load({}, function(model) {
			// Some changes in order to make it compatible with the RSS format
			var data = model.data;
			var nPosts = data.length;
			for (var i = 0; i < nPosts; i++) {
				data[i].title = data[i].slug.replace(/-/g, ' ');
				data[i].title = data[i].title[0].toUpperCase() + data[i].title.substr(1);
				data[i].content = data[i].content;
				data[i].date = posts.formatDateRFC822(data[i].date);
				data[i].link = 'http://blog.tomasperez.com/post/' + data[i].category + '/' + data[i].slug + '/';
			}

			callback({
				pub_date: posts.formatDateRFC822(),
				build_date: posts.formatDateRFC822(),
				static_domain: ServerCore.staticDomain(),
				api_url: ServerCore.apiDomain(),
				post: data
			});
		});

	}
};

this.actions = {
	'blog.index': this.blog.index,
	'admin.index': this.admin.index,
	'rss.index': this.rss.index
};
