var Admin = {

	bindMap: {
	},

	loginForm: {

		getLoginData: function() {
			return {login: DOM.get('login').value,
					password: DOM.get('password').value}
		},

		error: function() {
			DOM.get('loginForm').className = 'error';
		},

		clear: function() {
			DOM.get('login').value = '';
			DOM.get('password').value = '';
		}
	},

	api: function(method, params, onSuccess, onError) {
		if (this.isLogged()) {
			// Add the login info to the params
			var params = this.addSessionInfo(params);
			AjaxEngine.post(method, params, onSuccess, onError);
		}
	},

	addSessionInfo: function(params) {
		var session = Session.get();
		params.login = session.login;
		params.session = session.challenge;
		return params;
	},

	login: function() {

		var self = this,
		loginData = this.loginForm.getLoginData();

		if (loginData.login !== '' && loginData.password !== '') {
			AjaxEngine.post('login', loginData, function(data) {
				if (typeof data.id !== 'undefined') {
					Session.set(data);
					DOM.toggle('loginForm');
					Post.Content.showPosts()
				} else {
					self.loginForm.error();
				}
			}, function() {
				self.loginForm.error();
			});
		} else {
			this.loginForm.error();
		}

	},

	logout: function() {
		Session.destroy();
		DOM.toggle(['main', 'loginForm']);
		this.loginForm.clear();
	},

	isLogged: function() {
		var logged = false,
		session = Session.get(); 
		if (typeof session.id !== 'undefined' && typeof session.challenge !== 'undefined') {
			logged = true;
		}
		return logged;
	},

	init: function() {
		Post.Content.showPosts();
		this.bindEvents();
	},

	bindEvents: function() {
		for(var elementId in this.bindMap) {
			if( this.bindMap.hasOwnProperty(elementId) ) {
				DOM.get(elementId).onclick = this.bindMap[elementId];
			}
		}
	}

};

var Session = {

	TTL: 1,
	SESSION: 'session',

	set: function(data) {
		var TTLDate = new Date();
		TTLDate.setDate(TTLDate.getDate() + this.TTL);

		var value = this.SESSION + '=' + JSON.stringify(data) + '; expires=' + TTLDate.toUTCString();

		document.cookie= value;
	},

	get: function(name) {
		
		var session = {};

		if (typeof name === 'undefined') {
			name = this.SESSION;
		}

		var cookies = document.cookie.split(';'),
		length = cookies.length;

		for (var i = 0; i < length; i++) {
			var data = cookies[i].split('=');
			if (data[0] === name && data[1] !== '') {
				session = JSON.parse(data[1]);
				break;
			}
		}
		
		return session;

	},

	destroy: function() {
		document.cookie = 'session=; expires=-1';
	}

};

var Post = {

	Content: {
		showPosts: function() {
			DOM.show('main');
			Admin.api('getPosts', {}, function(posts) {
				DOM.get('posts').innerHTML = posts;
				DOM.get('newPost').onclick = Post.add;
			});
		},

		updatePost: function(data) {
			var postId = data.id,
				post = DOM.get('post_content_' + postId),
				slug = DOM.get('post_slug_' + postId),
				category = DOM.get('post_category_' + postId),
				date = DOM.get('post_date_' + postId);

			post.value = data.content;
			date.innerHTML = data.date;
		}
	},

	add: function() {

		var content = DOM.get('newPostContent'),
		postData = {
			content: content.value
		};

		Admin.api('addPost', postData, function(data) {
			if (typeof data.id !== 'undefined') {
				Post.Content.showPosts();
				content.value = '';
			}
		});
	},

	_processPost: function(post, method, callback) {
		var postId = post.getAttribute('postId'),
		postData = {
			content: DOM.get('post_content_' + postId).value,
			slug: DOM.get('post_slug_' + postId).value,
			category: DOM.get('post_category_' + postId).value,
			id: postId 
		};

		Admin.api(method, postData, callback);
	},

	update: function(post) {
		this._processPost(post, 'updatePost', function(data) {
			if (typeof data.id !== 'undefined') {
				Post.Content.updatePost(data);
			}
		});
	},

	remove: function(post) {
		this._processPost(post, 'removePost', function(data) {
			if (typeof data.id !== 'undefined') {
				DOM.get('post_' + data.id).innerHTML = '';
			}
		});
	}

};


