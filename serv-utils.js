(function(){

exports.takeout = function(array,key) {
	var i = array.indexOf(key);
	if (i != -1) {
		array.splice(i, 1);
	}
}

exports.originIsAllowed = function(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

})();
