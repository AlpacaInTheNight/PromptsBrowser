import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore from '../store';
import updateCurrentCollection from "./updateCurrentCollection";


export default function onAssignAutogenStyle() {
    const {data} = Database;
    const {filterCollection} = appStore.getState();
    const {selectedPrompts, autogenCol, autogenStyle} = collectionToolsStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!selectedPrompts || !selectedPrompts.length || !targetCollection) return;

    for(const promptId of selectedPrompts) {
        const prompt = targetCollection.find(item => item.id === promptId);
        if(!prompt) continue;

        if(autogenCol && autogenStyle) prompt.autogen = {collection: autogenCol, style: autogenStyle};
        else delete prompt.autogen;
    }

    updateCurrentCollection();
}
