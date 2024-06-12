import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import checkFilter from "client/checkFilter";
import CollectionTools from "./index";

function updateCurrentCollection() {
    const {state} = PromptsBrowser;
    const {data} = Database;
    const {promptsFilter} = PromptsBrowser.state;
    const {collectionToolsId, selectedCollectionPrompts} = state;
    if(!collectionToolsId) return;
    const filterSetup = promptsFilter["collectionTools"];
    const targetCollection = data.original[collectionToolsId];
    if(!targetCollection) return;

    for(const item of targetCollection) {
        const {id} = item;
        if(!id) continue;

        /**
         * Removing prompt from selected if it will not be shown.
         */
        if(!checkFilter(item, filterSetup)) {
            if(selectedCollectionPrompts.includes(id)) {
                state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(selId => selId !== id);
            }

            continue;
        }
    }

    Database.saveJSONData(collectionToolsId);
    Database.updateMixedList();
    CollectionTools.updateViews();
}

export default updateCurrentCollection;
