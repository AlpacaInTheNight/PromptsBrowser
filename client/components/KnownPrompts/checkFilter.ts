import appStore from 'client/store'
import Prompt from 'clientTypes/prompt'


export default function checkFilter(prompt: Prompt) {
    const {filterCollection, filterCategory, filterName, filterTags} = appStore.getState();

    if(filterCategory) {
        if(filterCategory === "__none") {
            if(prompt.category !== undefined && prompt.category.length) return false;

        } else {
            if(!prompt.category) return false;
            if(!prompt.category.includes(filterCategory)) return false;
        }
    }

    if(filterCollection) {
        if(!prompt.collections) return false;
        if(!prompt.collections.includes(filterCollection)) return false;
    }

    if(filterName) {
        if(!prompt.id.toLowerCase().includes(filterName)) return false;
    }

    if(filterTags && Array.isArray(filterTags)) {
        if(!prompt.tags) return false;
        let out = true;
        const TAG_MODE = "includeAll";

        if(TAG_MODE === "includeAll") {
            out = false;

            for(const filterTag of filterTags) {
                let fulfil = false;

                for(const promptTag of prompt.tags) {
                    if(promptTag === filterTag) {
                        fulfil = true;
                        break;
                    }
                }

                if(!fulfil) {
                    out = true;
                    break;
                }
            }

        } else {
            for(const filterTag of filterTags) {
                for(const promptTag of prompt.tags) {
                    if(promptTag.includes(filterTag)) {
                        out = false;
                        break;
                    }
                }
            }
        }
        
        if(out) return false;
    }

    return true;
}
