const bb = require('./beepBoop');

var stdin = process.openStdin();

stdin.addListener("data", function(inputRaw) {
	var inputString = inputRaw.toString().trim();  // convert the input buffer to a string

	var parsed      = bb.parseString(inputString);
	var evaled      = bb.eval(parsed);
	var stringified = bb.stringify(evaled);

	console.log(stringified);
});
