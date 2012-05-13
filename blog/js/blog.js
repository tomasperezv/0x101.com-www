var Blog = {

	navigators: ['navigatorPrev', 'navigatorNext'],

	init: function(category, label) {
		var n = this.navigators.length;
		for(var i=0;i<n;i++) {
			this.bindNavigate(this.navigators[i]);
		}
		this.updateURL(category, label);
	},

	bindNavigate: function(id) {
		var el = DOM.get(id);
		if (el.style.display !== 'none') {
			el.onclick = this.navigate;
		}
	},

	navigate: function(event) {

		var position = parseInt(this.getAttribute('position')),
			self = this;

		AjaxEngine.post(
			'getPost', 
			{position: position}, 
			function(result) {
				DOM.get('post').innerHTML = result.post;

				Blog.updateURL(result.category, result.label);

				var next = DOM.get('navigatorNext'),
					prev = DOM.get('navigatorPrev');

				if (position > 0) {
					next.setAttribute('position', parseInt(position)-1);
					next.style.display = '';
					next.onclick = Blog.navigate;
				} else {
					next.style.display = 'none';
				}

				if ( (result.count - position) > 1) {
					prev.setAttribute('position', parseInt(position)+1);
					prev.style.display = '';
					prev.onclick = Blog.navigate;
				} else {
					prev.style.display = 'none';
				}

			});
	}, 

	updateURL: function(category, label) {
		if (window.history && window.history.pushState) {
			window.history.pushState({category: category, label: label}, '', '/post/' + category + '/' + label + '/');
		}
	}

};
