
String.prototype.replaceAllRegex = function(oldStr, newStr) {
	return this.replace(new RegExp(oldStr, 'g'), newStr);
};

/**
 * Make sure to update client-side makeFileNameSafe method as well
 */
function makeFileNameSafe(fileName) {
	fileName = fileName.replaceAllRegex("_", " ");

	//unix/win
	fileName = fileName.replaceAllRegex("/", "_fsl_");

	//win
	fileName = fileName.replaceAllRegex(":", "_col_");
	fileName = fileName.replaceAllRegex("\\\\", "_bsl_");
	fileName = fileName.replaceAllRegex("<", "_lt_");
	fileName = fileName.replaceAllRegex(">", "_gt_");
	fileName = fileName.replaceAllRegex("\"", "_dq_");
	fileName = fileName.replaceAllRegex("\\|", "_pip_");
	fileName = fileName.replaceAllRegex("\\?", "_qm_");
	fileName = fileName.replaceAllRegex("\\*", "_ast_");

	fileName = fileName.trim();

	return fileName;
}

function compareObjects(obj1, obj2) {
	for(const fieldId in obj1) {
		if(typeof obj1[fieldId] === "object") {
			if(typeof obj2[fieldId] !== "object") return false;

			const result = compareDeep(obj1[fieldId], obj2[fieldId], true);
			if(!result) return false;

		} else {
			if(obj1[fieldId] !== obj2[fieldId]) return false;
		}
	}

	return true;
}

/**
 * Deep comparison of two objects. Does not checks complex data like time or NaN. Only does fast operations.
 * @param obj1 
 * @param obj2 
 * @returns true if objects are identical by simple comparison
 */
function compareDeep(obj1, obj2, _recursive = false) {

	if(!obj1 && obj2) return false;
	if(obj1 && !obj2) return false;
	if(!obj1 && !obj2) return true;

	let result = compareObjects(obj1, obj2);
	if(!result) return false;

	/**
	 * Checking for a fields that are present in obj2, but not in obj1
	 */
	if(!_recursive) {
		result = compareObjects(obj2, obj1);
		if(!result) return false;
	}

	return true;
}

exports.makeFileNameSafe = makeFileNameSafe;
exports.compareDeep = compareDeep;
