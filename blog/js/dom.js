/**
 * @author tom@0x101.com
 *
 * Basic DOM operations
 */
var DOM = {

	/**
	 * @author tom@0x101.com  
	 * @param Object|string|Array el
	 */
	toggle: function(el) {

		if ( Types.isArray(el) ) {
			var n = el.length;
			for (var i = 0; i < n; i++) {
				this.toggle(el[i]);
			}
		} else {
			var el = (typeof el == 'string' ? this.get(el) : el),
				style = el.style;
			style.display = (style.display == 'none' ? '' : 'none');
		}
	},

	show: function(el) {
		var el = (typeof el == 'string' ? this.get(el) : el),
			style = el.style;
		if (style.display == 'none') {
			style.display = '';
		}
	},

	get: function(id) {
		return document.getElementById(id);
	},

	inject: function(el, rawHTML, customFunc) {

		if (document.createRange) {
			var el = (typeof el == 'string' ? this.get(el) : el),
				range = document.createRange();

			range.selectNode(el);

			var rawTemplate = range.createContextualFragment(rawHTML),
				template = document.createDocumentFragment(),
				nChilds = rawTemplate.childNodes.length;

			el.innerHTML = '';

			for(var i=0;i<nChilds;i++) {
				var node = rawTemplate.childNodes[i].cloneNode(true);

				if (typeof customFunc === 'undefined') {
					if ( this.isScriptElement(node) ) {
						var script = document.createElement('script');
						script.type = 'text/javascript';
						script.src = node.src;
						template.appendChild(script);
					} else {
						template.appendChild(node);
					}
				} else {
					customFunc(node, el);
				}

			}

			if (typeof customFunc === 'undefined') {
				el.appendChild(template);
			}

		} else {
			el.innerHTML = rawHTML;
		}

	},

	isScriptElement: function(node) {
		return node.nodeType === Node.ELEMENT_NODE &&
				node.toString().indexOf('HTMLScriptElement') > 0
	}
};

var Types = {
	isArray: function(value) {
		return Object.prototype.toString.apply(value) === '[object Array]';
	}
}

