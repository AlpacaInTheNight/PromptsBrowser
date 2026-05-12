import * as React from 'react'
import Database from 'client/Database'
import ActivePrompts from 'client/managers/ActivePrompts'
import previewStore, { setPreviewCollection } from 'client/components/PreviewSave/store'
import appStore, {
    updateCurrentIteration, setEditPrompt, setEditTargetCollection, setSelectedPrompt, setEditPromptGroup, setEditPromptIndex,
    setShowPromptScribe,
} from 'client/store'


export default function onPromptClick(e: React.MouseEvent<HTMLDivElement>) {
    const {selectedPrompt} = appStore.getState();
    const {previewCollection} = previewStore.getState();
    const target = e.currentTarget as HTMLElement;
    const {readonly} = Database.meta;
    const {united, original} = Database.data;
    const currentId = target.dataset.prompt;
    let index: number = Number(target.dataset.index);
    let group: number | false = Number(target.dataset.group);
    const isSyntax = target.dataset.issyntax ? true : false;
    let groupId: false | number = Number(target.dataset.id);
    if(Number.isNaN(group)) group = false;
    if(Number.isNaN(groupId)) groupId = false;

    //is prompts group
    if(groupId !== false) {
        
        if(e.ctrlKey || e.metaKey) ActivePrompts.unGroup(groupId);
        else ActivePrompts.toggleGroupFold(groupId);
        
        updateCurrentIteration();
        ActivePrompts.updateTextArea();

        return;
    }

    if(!currentId) return;

    //on remove element
    if(e.ctrlKey || e.metaKey) {
        if(Number.isNaN(index)) return;
        if(Number.isNaN(group)) group = false;

        ActivePrompts.removePrompt(index, group);
        updateCurrentIteration();
        ActivePrompts.updateTextArea();

        return;
    }

    if(isSyntax) return;

    const targetPrompt = united.find(item => item.id.toLowerCase() === currentId.toLowerCase());

    if(targetPrompt && targetPrompt.collections && targetPrompt.collections[0]) {
        if(!previewCollection || !targetPrompt.collections.includes(previewCollection)) {
            setPreviewCollection(targetPrompt.collections[0]);
        }
    }

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

        } else {
            setShowPromptScribe(true)
        }

        return;
    }

    if(selectedPrompt !== currentId) {
        setSelectedPrompt(currentId);
        setEditPromptGroup(group);
        setEditPromptIndex(index);
    } else {
        setSelectedPrompt(undefined);
        setEditPromptGroup(false);
        setEditPromptIndex(false);
    }
    
    updateCurrentIteration();
}
