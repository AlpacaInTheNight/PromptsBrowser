import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore from '../store';
import updateCurrentCollection from "./updateCurrentCollection";


export default function onAddCategory() {
    const {data} = Database;
    const {filterCollection} = appStore.getState();
    const {category, selectedPrompts} = collectionToolsStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!selectedPrompts || !selectedPrompts.length || !targetCollection || !category) return;

    for(const promptId of selectedPrompts) {
        const prompt = targetCollection.find(item => item.id === promptId);
        if(!prompt) continue;

        if(!prompt.category) prompt.category = [];
        if(!prompt.category.includes(category)) prompt.category.push(category);
    }

    updateCurrentCollection();
}
