import {setFilterTags} from 'client/store'
import StaticStore from './staticStore';


export default function updateFilterTags(tags: string[]) {
    let filterTags: string[] | undefined = undefined;

    //removing empty tags
    tags = tags.filter(item => item);
    
    if(!tags) filterTags = undefined;
    else filterTags = tags;

    if(filterTags && !filterTags.length) filterTags = undefined;
    if(filterTags && filterTags.length === 1 && !filterTags[0]) filterTags = undefined;

    clearTimeout(StaticStore.updateTimeout);

    StaticStore.updateTimeout = setTimeout(() => setFilterTags(filterTags), 500);
}
