/**
 * @author <tom@0x101.com>
 * @class Api
 */
var Setup = require('./setup.js'),
	basedir = Setup.serverDirectory;

var Post = require('./model/post').Post,
	User = require(basedir + '/model/user').User,
	Salt = require(basedir + '/model/salt').Salt,
	Session = require(basedir + '/model/session').Session,
	Router = require(basedir + '/router.js'),
	Handlebars = require('handlebars'),
	DataBaseFormat = require(basedir + '/database/database-format'),
	fs = require('fs'),
	qs = require('querystring');

responseA = null;

this.getDefaultData = function() {
	return {
		success: false,
		message: 'Unknown method'
	};
};

this.serve = function(request, response) {

	responseA = response;

	var apiMethod = request.url.substring(1),
	data = this.getDefaultData(),
	self = this;

	// TODO: Find a better way to redirect api calls to methods
	switch (apiMethod) {

		case 'getPost':
			self.getPost(request);
			break;

		case 'getPosts':
			this.servePrivate(request, function(data) {
				self.getPosts(data);
			});

			break;

		case 'addUser':
			this.addUser(request);
			break;

		case 'login':
			this.login(request);
			break;
		
		case 'addPost':
			this.servePrivate(request, function(data) {
				self.addPost(data);
			});
			break;

		case 'updatePost':
			this.servePrivate(request, function(data) {
				self.updatePost(data);
			});

			break;

		case 'filterTweets':
			this.filterTweets(request);
			break;

		case 'removePost':
			this.servePrivate(request, function(data) {
				self.removePost(data);
			});

			break;

		default:
			this.responseCallback({'status': 'active'});
			// Nothing to do here, move along
			break
	}

};

this.removeSessionParams = function(params) {
	delete params.login;
	delete params.session;
	return params;
};

this.servePrivate = function(request, callback) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {

		var data = qs.parse(body);

		var user = new User();
		user.getByLogin(data.login, function(user) {

			var session = new Session();
			session.check(user.id, data.session, function(sessionData) {
				if (typeof sessionData.id !== 'undefined') {
					data = api.removeSessionParams(data);
					callback(data);
				} else {
					api.responseCallback({});
				}
			});

		});

	});
};

this.responseCallback = function(data) {
	responseA.writeHead(200, {
		'Content-type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	responseA.write(JSON.stringify(data), "utf-8");

	responseA.end();
};

this.getPosts = function() {

	var api = this,
	templateName = './www/blog/templates/posts.mustache';

	var posts = new Post();
	posts.load({}, function(model) {

		fs.readFile(templateName, "binary", function(err, template) {
			if (err) {
				console.log('Template not found');
				api.responseCallback({});
			} else {
				console.log('serving template ' + templateName);

				var template = Handlebars.compile(template),
					output = template({post: model.data});

				responseA.writeHead(200, {
					'Content-type': 'text/html',
					'Access-Control-Allow-Origin': '*'
				});
				responseA.write(output, "utf-8");
				responseA.end();
			}
		});

	});

};

this.getPost = function(request) {

	var api = this,
		post = new Post(),
		body = '';

	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = qs.parse(body);

		post.getPosts({position: data.position}, function(data) {
			api.responseCallback(data);
		});
	});

};

this.addPost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {
		var posts = new Post();
		posts.create({content: data.content, date: DataBaseFormat.timestamp()}, function(postId)	{
			console.log('created post ' + postId);
			api.responseCallback({id: postId});
		});
	}

};

this.updatePost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {

		var post = new Post();

		post.update(data, function(postContent)	{
			api.responseCallback(postContent);
		});
	}

};

this.removePost = function(data) {

	var api = this;

	if (typeof data.content !== 'undefined') {
		var post = new Post();
		post.remove(data, function(postId)	{
			api.responseCallback({id: postId});
		});
	}

};

this.addUser = function(request) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = qs.parse(body);
		var user = new User();
		user.addUser(data.login, data.password, api.responseCallback);
	});

};

this.login = function(request) {

	var api = this;

	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = qs.parse(body),
		user = new User();

		user.validate(data.login, data.password, function(user) {

			if (typeof user.id !== 'undefined') {

				var session = new Session();
				session.createAndLoad({user_id: user.id, challenge: session.getRandomString(), creation_date: DataBaseFormat.timestamp()}, function(session) {
					// Add the username to the session info
					session.login = data.login;
					api.responseCallback(session);
				});

			} else {
				api.responseCallback({});
			}

		});
	});
};

/**
 * @author tom@0x101.com
 * API interface for filtering tweets using the google prediction API,
 * used by the geo-twitter service: http://geo-twitter.tomasperez.com/
 */
this.filterTweets = function(request) {
	GeoTwitter = require('./geo-twitter/server/geo-twitter.js')(),
	GeoTwitter.filterTweets(function(data) {
		responseA.send(data);
	}, request);
};
