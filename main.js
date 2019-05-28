var stdin = process.openStdin();

const NUMBER     = '1234567890.,';
const OPERATOR   = '+-*/^';
const COMPARISON = '=><';
const SEPARATORS = '[]{}()';

stdin.addListener("data", function(inputRaw) {
	var inputString = inputRaw.toString().trim(); // convert the input buffer to a string
	var inputArray  = inputString.split('');
});
