const NUMBER     = '1234567890.,';
const OPERATOR   = '+-*/^';
const COMPARISON = '=><';
const BRACKET    = '[]{}()';
const BRACKET_O  = '[{(';
const BRACKET_C  = ']})';

/**
 * parse an input string into elements for the solve function
 *
 * @param {*} inputString input from the user
 * @returns parsed math object
 */
module.exports.parseString = function(inputString) {
	var output = { types: [], segments: []};

	var segmentType    = '';  // store the current segment type
	var segmentIndex   = -1;  // and index,
	var newSegmentType = '';  // and the segment type of the char
	var sectionString  = '';

	for (let i = 0; i < inputString.length; i++) {  // loop through each char
		const char = inputString[i];

		if (char == ' ') {  // ignore spaces
			continue
		}

		if (NUMBER.includes(char)) {  // determine the segment type of char
			newSegmentType = 'number';
		} else if (OPERATOR.includes(char)) {
			newSegmentType = 'operator';
		} else if (COMPARISON.includes(char)) {
			newSegmentType = 'comparison';
		} else if (BRACKET_O.includes(char)) {
			newSegmentType = 'section';


		} else {
			console.error('WARNING: ignoring illegal symbol "'+ char +'"!');
			continue;
		}

		if (segmentType == newSegmentType && (segmentType == 'number' || segmentType == 'comparason')) {  // if continuing a number or comparason segment
			output.segments[segmentIndex] += char;  // add the char to the segment
		} else {
			segmentType = newSegmentType;  // update the segment type
			segmentIndex++;                // inc the segment index

			output.types   [segmentIndex] = segmentType;  // store the segment type
			output.segments[segmentIndex] = char;         // and new segment
		}
	}

	return output
}
