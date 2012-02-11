var Admin = {

	loginForm: {

		getLoginData: function() {
			return {login: document.getElementById('login').value,
					password: document.getElementById('password').value}
		},

		error: function() {
			document.getElementById('loginForm').className = 'error';
		},

		clear: function() {
			document.getElementById('login').value = '';
			document.getElementById('password').value = '';
		},
	},

	login: function() {

		var self = this,
		loginData = this.loginForm.getLoginData();

		if (loginData.login !== '' && loginData.password !== '') {
			AjaxEngine.post('login', loginData, function(data) {
				if (typeof data.id !== 'undefined') {
					Session.set(data);
					loginForm.style.display = 'none';
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
		document.getElementById('main').style.display = 'none';
		document.getElementById('loginForm').style.display = '';
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
		document.getElementById('main').style.display = '';
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

