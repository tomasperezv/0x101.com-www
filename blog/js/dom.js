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
			el = (typeof el == 'string' ? this.get(el) : el);
			var style = el.style;
			style.display = (style.display == 'none' ? '' : 'none');
		}
	},

	show: function(el) {
		el = (typeof el == 'string' ? this.get(el) : el);
		var style = el.style;
		if (style.display == 'none') {
			style.display = '';
		}
	},

	get: function(id) {
		return document.getElementById(id);
	}
};

var Types = {
	isArray: function(value) {
		return Object.prototype.toString.apply(value) === '[object Array]';
	}
}

