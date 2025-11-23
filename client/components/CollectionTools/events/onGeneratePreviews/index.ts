import Database from "client/Database/index";
import DOMCache from "client/DOMCache";
import collectionToolsStore from "../../store";
import appStore from "client/store";
import { GenerateRequest } from "../../type";
import generateNextPreview from "./generateNextPreview";
import StaticStore from "./StaticStore";


export default function onGeneratePreviews() {
    const {data} = Database;
    const {currentContainer, filterCollection} = appStore.getState();
    const {selectedPrompts, generateMode, autogenCol, autogenStyle} = collectionToolsStore.getState();

    const textArea = DOMCache.containers[currentContainer].textArea;
    const targetCollection = data.original[filterCollection];
    let currentPrompt = "";

    if(!selectedPrompts || !selectedPrompts.length || !targetCollection) return;

    StaticStore.generateQueue = [];

    if(generateMode === "current" && textArea) {
        currentPrompt = textArea.value;
    }

    for(const promptId of selectedPrompts) {
        const prompt = targetCollection.find(item => item.id === promptId);
        if(!prompt) continue;

        const generateItem: Partial<GenerateRequest> = {
            id: promptId,
        };

        if(generateMode === "current") {
            generateItem.addPrompts = currentPrompt;

        } else if(generateMode === "autogen") {
            if(prompt.autogen) generateItem.autogen = {...prompt.autogen};

        } else if(generateMode === "selected") {
            if(prompt.autogen) generateItem.autogen = {
                collection: autogenCol,
                style: autogenStyle,
            };
        }

        StaticStore.generateQueue.push(generateItem as GenerateRequest);
    }

    generateNextPreview();
}
