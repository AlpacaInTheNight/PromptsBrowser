import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore from '../store';
import updateCurrentCollection from "./updateCurrentCollection";


export default function onAddTags() {
    const {data} = Database;
    const {filterCollection} = appStore.getState();
    const {tags, selectedPrompts} = collectionToolsStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!selectedPrompts || !selectedPrompts.length || !targetCollection || !tags) return;

    const tagsArr = tags.split(",");
    for(let i = 0; i < tagsArr.length; i++) tagsArr[i] = tagsArr[i].trim();

    for(const promptId of selectedPrompts) {
        const prompt = targetCollection.find(item => item.id === promptId);
        if(!prompt) continue;

        if(!prompt.tags) prompt.tags = [];

        for(const tagItem of tagsArr) {
            if(!prompt.tags.includes(tagItem)) prompt.tags.push(tagItem);
        }
    }

    updateCurrentCollection();
}
