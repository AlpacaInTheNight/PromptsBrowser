
if(!window.PromptsBrowser) window.PromptsBrowser = {};
if(!PromptsBrowser.utils) PromptsBrowser.utils = {};

/**
 * Returns true if prompt passes filter requirements
 * @param {*} prompt 
 * @param {*} filter 
 * @returns boolean
 */
PromptsBrowser.utils.checkFilter = (prompt, filter) => {
	if(!filter || !filter.length) return true; //no filter requirements
	let {id, comment = "", autogen = {}} = prompt;
	if(!id) return false; //invalid prompt

	const {tags = [], category = [], previewImage} = prompt;
	let fulfil = false;

	id = id.toLowerCase();
	comment = comment.toLowerCase();
    const haveAutogen = autogen.collection && autogen.style;

	for(const filterItem of filter) {
		const {action, type, value} = filterItem;
		const isInclude = action === "include";
		fulfil = false;

		if(type === "name") {
			if(id.includes(value)) fulfil = isInclude ? true : false;
			else if(!isInclude) fulfil = true;

		} else if(type === "category") {

			if(value === "__none") {
				if(!category.length) fulfil = isInclude ? true : false;

			} else {
				if(category.includes(value)) fulfil = isInclude ? true : false;
				else if(!isInclude) fulfil = true;

			}
		} else if(type === "tag") {
			if(tags.includes(value)) fulfil = isInclude ? true : false;
			else if(!isInclude) fulfil = true;

		} else if(type === "meta") {
			
			if(value === "preview") fulfil = isInclude ? !!previewImage : !previewImage;
			else if(value === "png") fulfil = isInclude ? previewImage === "png" : previewImage !== "png";
			else if(value === "jpg") fulfil = isInclude ? previewImage === "jpg" : previewImage !== "jpg";
			else if(value === "categories") fulfil = isInclude ? category.length : !category.length;
			else if(value === "tags") fulfil = isInclude ? !!tags.length : !tags.length;
			else if(value === "comment") fulfil = isInclude ? !!comment : !comment;
			else if(value === "autogen") fulfil = isInclude ? haveAutogen : !haveAutogen;

            else if(value === "categories3") fulfil = isInclude ? category.length >= 3 : category.length < 3;
            else if(value === "tags3") fulfil = isInclude ? tags.length >= 3 : tags.length < 3;

		}

		if(!fulfil) return false;
	}

	return true;
}
