fs = require('fs');

this.configFile = __dirname + '/setup.json';

try {
	var data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));

	for (var property in data) {
		if (data.hasOwnProperty(property)) {
			this[property] = data[property];
		}
	}
} catch(e) {
}
