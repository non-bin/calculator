const NUMBER     = '1234567890.,';
const OPERATOR   = '+-*/^';
const COMPARISON = '=><';
const BRACKET_O  = '[{(';
const BRACKET_C  = ']})';

/**
 * parse an input string into elements for the solve function
 *
 * @param {String} inputString input from the user
 * @returns {*} parsed math object
 */
module.exports.parseString = function(inputString) {
	var output = { types: [], values: []};

	var segmentType    = '';  // store the current segment type
	var segmentIndex   = -1;  // and index,
	var newSegmentType = '';  // and the segment type of the char
	var sectionString  = '';

	for (let i = 0; i < inputString.length; i++) {  // loop through each char
		var char = inputString[i];

		if (char == ' ') {  // ignore spaces
			continue
		}

		if (NUMBER.includes(char)) {  // determine the segment type of char
			newSegmentType = 'number';
		} else if (OPERATOR.includes(char)) {
			newSegmentType = 'operator';
		} else if (COMPARISON.includes(char)) {
			newSegmentType = 'comparison';
		} else if (BRACKET_O.includes(char)) {  // if it's a bracketed section
			newSegmentType = 'section';

			if (['section', 'number'].includes(output.types[segmentIndex])) {  // if the previous segment is a section or number, add the implied *. eg 1(2) -> 1*(2)
				segmentIndex++;
				output.types [segmentIndex] = 'operator';
				output.values[segmentIndex] = '*';
			}

			sectionString = '';
			i++;
			char = inputString[i];

			while (!BRACKET_C.includes(char)) {  // determine the bracket section string
				sectionString += char;

				i++;
				char = inputString[i];
			}

			segmentType = newSegmentType;  // update the segment type
			segmentIndex++;                // inc the segment index

			output.types [segmentIndex] = segmentType;                                // store the segment type
			output.values[segmentIndex] = module.exports.parseString(sectionString);  // recur

			continue;
		} else {
			console.error('WARNING: ignoring illegal symbol "'+ char +'"!');
			continue;
		}

		if (segmentType == newSegmentType && (segmentType == 'number' || segmentType == 'comparason')) {  // if continuing a number or comparason segment
			output.values[segmentIndex] += char;  // add the char to the segment
		} else {
			segmentType = newSegmentType;  // update the segment type
			segmentIndex++;                // inc the segment index

			if (segmentIndex == 1 && newSegmentType == 'number' && output.values[0] == '-') {  // if it's a negative number
				segmentIndex = 0;

				output.types [0] = segmentType;  // store the segment type
				output.values[0] = '-'+char;     // and new segment
			} else {
				output.types [segmentIndex] = segmentType;  // store the segment type
				output.values[segmentIndex] = char;         // and new segment
			}
		}
	}

	for (let i = 0; i < output.types.length; i++) {
		if (output.types[i] == 'number') {  // if the previous segment was a number, parse it properly
			output.values[i] = parseFloat(output.values[i]);
		}
	}

	return output
}

/**
 * evaluate a parsed math object
 *
 * @param {*} input in input parsed math object
 * @returns {*} answer
 */
module.exports.eval = function(input) {
	var output = { types: [], values: []};
	var output = input;

	// brackets
	for (let i = 0; i < output.types.length; i++) {
		const segment = { type: output.types[i], value: output.values[i]};

		if (segment.type == 'section') {
			output.types [i] = 'number';
			output.values[i] = module.exports.eval(segment.value).values[0];
		}
	}

	// powers
	for (let i = 0; output.values.includes('^'); i++) {
		if (output.values[i] == '^') {
			output.values[i-1] = Math.pow(output.values[i-1], output.values[i+1]);
			output.types.splice(i, 2);
			output.values.splice(i, 2);
		}
	}

	// multiplication & division
	for (let i = 0; output.values.includes('*') || output.values.includes('/'); i++) {
		if (['*', '/'].includes(output.values[i])) {
			if (output.values[i] == '*') {
				output.values[i-1] = output.values[i-1] * output.values[i+1];
			} else {
				output.values[i-1] = output.values[i-1] / output.values[i+1];
			}
			output.types.splice(i, 2);
			output.values.splice(i, 2);

			i--;
		}
	}

	// addition & subtraction
	for (let i = 0; output.values.includes('+') || output.values.includes('-'); i++) {
		if (['+', '-'].includes(output.values[i])) {
			if (output.values[i] == '+') {
				output.values[i-1] = output.values[i-1] + output.values[i+1];
			} else {
				output.values[i-1] = output.values[i-1] - output.values[i+1];
			}
			output.types.splice(i, 2);
			output.values.splice(i, 2);

			i--;
		}
	}

	return output;
}

/**
 * convert a parsed math object to a human readable string
 *
 * @param {*} input in input parsed math object
 * @returns {String} the output string
 */
module.exports.stringify = function(input) {
	var output = '';

	for (let i = 0; i < input.types.length; i++) {
		const segment = { type: input.types[i], value: input.values[i]};

		if (segment.type == 'section') {
			output += '('+ module.exports.stringify(segment.value) +')';
		} else {
			output += segment.value;
		}
	}

	return output;
}
