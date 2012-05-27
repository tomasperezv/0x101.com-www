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

	_formatPost: function(data) {
		return  data.post + '<span class="author">Tom&aacute;s P&eacute;rez ' + data.date + '</span>';
	},

	_injectGist: function(node, el) {
		if ( DOM.isScriptElement(node) ) {

			var frame = document.createElement('iframe'),
				randomId = 'gist_' + Math.floor(Math.random()*1000);

			frame.id = randomId;
			frame.style.width = '100%';
			frame.style.border = 0;
			frame.frameborder = 0;
			frame.scrolling = 'no';
			el.appendChild(frame);

			var doc = frame.contentDocument || frame.contentWindow.document;
			var html = '<html>'+
				'<script type="text/javascript">' +
				'function adjust() {' +
				'var iframe = parent.document.getElementById("'+randomId+'");' +
				'iframe.height = document.body.offsetHeight;' +
				'}' +
				'</script>' +
				'<body onload="adjust();">' +
				'<script type="text/javascript" src="'+node.src+'"></script>' +   
				'</body>' +
				'</html>';

			doc.open('text/html',false);
			doc.write(html);
			doc.close();
			
		} else {
			el.appendChild(node);
		}
	},

	navigate: function(event) {

		var position = parseInt(this.getAttribute('position')),
			self = this;

		AjaxEngine.post(
			'getPost', 
			{position: position}, 
			function(result) {
				DOM.inject(DOM.get('post'), Blog._formatPost(result), Blog._injectGist);

				Blog.updateURL(result.category, result.label);

				var next = DOM.get('navigatorNext'),
					prev = DOM.get('navigatorPrev');

				if (position > 0) {
					prev.setAttribute('position', parseInt(position)-1);
					prev.style.display = '';
					prev.onclick = Blog.navigate;
				} else {
					prev.style.display = 'none';
				}

				if ( (result.count - position) > 1) {
					next.setAttribute('position', parseInt(position)+1);
					next.style.display = '';
					next.onclick = Blog.navigate;
				} else {
					next.style.display = 'none';
				}

			});
	}, 

	updateURL: function(category, label) {
		if (window.history && window.history.pushState) {
			window.history.pushState({category: category, label: label}, '', '/post/' + category + '/' + label + '/');
		}
	}

};
