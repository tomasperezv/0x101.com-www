var Admin = {

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
					DOM.toggle(loginForm);
					self.showPosts()
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

	showPosts: function() {
		DOM.toggle('main');
		this.api('getPosts', function(posts) {
		});
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

