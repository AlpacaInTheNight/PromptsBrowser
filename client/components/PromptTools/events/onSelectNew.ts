import Database from "client/Database";
import appStore, { setEditPrompt, setEditTargetCollection, updateCurrentIteration, setSelectedPrompt } from 'client/store'
import promptToolsStore from "../store";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import ActivePrompts from "client/managers/ActivePrompts";


export default function onSelectNew(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    const {data} = Database;
    const {united, original} = data;
    const {readonly} = Database.meta;
    const {editPromptIndex: index, editPromptGroup: groupId} = appStore.getState();
    const {replaceMode} = promptToolsStore.getState();
    const clickPrompt = target.dataset.prompt;
    if(index === false || !clickPrompt) return;

    const targetPrompt = united.find(item => item.id === clickPrompt);
    if(!targetPrompt) return;

    if(!readonly && e.shiftKey) {
        if(targetPrompt) {
            const targetItem = united.find(item => item.id === targetPrompt.id);
            if(!targetItem) return false;
            if(!targetItem.collections) return false;
            if(!targetItem.collections[0]) return false;

            let collection = original[targetItem.collections[0]];
            if(!collection) return false;

            const originalItem = collection.find(item => item.id === targetPrompt.id);
            if(!originalItem) return false;

            setEditPrompt(JSON.parse(JSON.stringify(originalItem)));
            setEditTargetCollection(targetItem.collections[0]);

        }

        return;
    }

    const newItem = {
        id: clickPrompt,
        weight: DEFAULT_PROMPT_WEIGHT,
        isExternalNetwork: targetPrompt.isExternalNetwork,
    };

    let action: "add" | "replace" = "add";

    if(replaceMode) action = e.altKey ? "add" : "replace";
    else action = e.altKey ? "replace" : "add";

    if(action === "add") ActivePrompts.insertPrompt(newItem, index + 1, groupId);
    else ActivePrompts.replacePrompt(newItem, index, groupId);

    setSelectedPrompt(targetPrompt.id);
    ActivePrompts.updateTextArea();
    updateCurrentIteration();
}
