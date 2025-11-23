import { FilterSimple } from "client/types/filter";
import Database from "client/Database";


/**
 * Returns true if prompt passes filters params
 * @param {*} promptId
 * @param {*} filters
 * @returns 
 */
export default function checkFilter(promptId: string, filters: FilterSimple = {}) {
    if(!promptId) return false;
    const {data} = Database;
    const {unitedList} = data;
    let onlyName: boolean = false;
    const {collection = "", category = "", tags = [], name = ""} = filters;

    if(!collection && !category && !name && !tags.length) return true;
    if(!collection && !category && !tags.length && name) onlyName = true;

    //checkinig name first in order to be able to filter new prompts name not yet in collections.
    //cheking name
    if(name && !promptId.toLowerCase().includes(name)) return false;
    if(onlyName) return true;

    const unitedPrompt = unitedList[promptId];

    //prompt data not found
    if(!unitedPrompt) return false;

    //checking collections
    if(collection && !unitedPrompt.collections.includes(collection)) return false;

    //checking categories
    if(category) {
        if(category === "__none" && unitedPrompt.category.length) return false;
        else if(category !== "__none" && !unitedPrompt.category.includes(category)) return false;
    }

    //checking tags
    if(tags.length) {
        for(const tagItem of tags) {
            if(!unitedPrompt.tags.includes(tagItem)) return false;
        }
    }

    return true;
}
