// 正規表現
const regexp = {
	'pt_1': /href|src/,
	'pt_2': /^="/,
	'pt_3': /"(?=\s|>)/,
	'pt_4': /^="|/,
	'pt_5': /\.html|\.gif|\.jpeg|\.jpg|\.png|\.css|\.js|\.svg/,
	'pt_6': /^\//,
	'pt_7': /http:\/\/|https:\/\//,
	'pt_8': /[A-Za-z](\/[A-Za-z]|\/$)/
};

module.exports = regexp;