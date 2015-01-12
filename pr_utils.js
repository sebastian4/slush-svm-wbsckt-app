exports.takeout = function(array,key) {
	var i = array.indexOf(key);
	if (i != -1) {
		array.splice(i, 1);
	}
}
