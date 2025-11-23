import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore from '../store';
import updateCurrentCollection from "./updateCurrentCollection";


export default function onRemoveCategory() {
    const {data} = Database;
    const {filterCollection} = appStore.getState();
    const {category, selectedPrompts} = collectionToolsStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!selectedPrompts || !selectedPrompts.length || !targetCollection || !category) return;

    for(const promptId of selectedPrompts) {
        const prompt = targetCollection.find(item => item.id === promptId);
        if(!prompt) continue;

        if(!prompt.category) continue;
        if(prompt.category.includes(category)) prompt.category = prompt.category.filter(id => id !== category);
    }

    updateCurrentCollection();
}
