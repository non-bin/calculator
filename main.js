const beepBoop = require('./beepBoop');

var stdin = process.openStdin();

stdin.addListener("data", function(inputRaw) {
	var inputString = inputRaw.toString().trim();  // convert the input buffer to a string

	console.log(beepBoop.parseString(inputString));
});
