import Prompt from "clientTypes/prompt";
import Filter from "clientTypes/filter";
import { getCheckpoint, makeFileNameSafe } from "client/utils/index";

/**
 * Returns true if prompt passes filter requirements
 * @param {*} prompt 
 * @param {*} filter 
 * @returns boolean
 */
function checkFilter(prompt: Prompt, filter: Filter[]) {
    if(!filter || !filter.length) return true; //no filter requirements
    let {id, comment = "", autogen = {}} = prompt;
    if(!id) return false; //invalid prompt

    const checkpoint = makeFileNameSafe(getCheckpoint() || "");
    const {tags = [], category = [], previewImage, previews = {}} = prompt;
    let fulfil = false;

    id = id.toLowerCase();
    comment = comment.toLowerCase();
    const haveAutogen: boolean = autogen.collection && autogen.style ? true : false;

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

            let modelPreview: string = "";
            if(value === "preview" || value === "png" || value === "jpg") {
                if(previews) {
                    for(const modelId in previews) {
                        if(previews[modelId]?.file) {
                            modelPreview = previews[modelId].file;
                            break;
                        }
                    }
                }
            }

            const previewFinal = previewImage ? previewImage : modelPreview;
            
            if(value === "preview") fulfil = isInclude ? !!previewFinal : !previewFinal;
            else if(value === "png") fulfil = isInclude ? previewFinal === "png" : previewFinal !== "png";
            else if(value === "jpg") fulfil = isInclude ? previewFinal === "jpg" : previewFinal !== "jpg";
            else if(value === "categories") fulfil = isInclude ? !!category.length : !category.length;
            else if(value === "tags") fulfil = isInclude ? !!tags.length : !tags.length;
            else if(value === "comment") fulfil = isInclude ? !!comment : !comment;
            else if(value === "autogen") fulfil = isInclude ? haveAutogen : !haveAutogen;

            else if(value === "categories3") fulfil = isInclude ? category.length >= 3 : category.length < 3;
            else if(value === "tags3") fulfil = isInclude ? tags.length >= 3 : tags.length < 3;

            else if (value === "previewModel") fulfil = isInclude ? !!previews[checkpoint] : !previews[checkpoint];
        }

        if(!fulfil) return false;
    }

    return true;
}

export default checkFilter;
