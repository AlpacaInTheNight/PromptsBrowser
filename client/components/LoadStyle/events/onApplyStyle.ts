import Database from "client/Database";
import ActivePrompts from "client/managers/ActivePrompts";
import loadStyleStore from "../store";


export default function onApplyStyle(isAfter?: boolean) {
    const selectedStyle = loadStyleStore.getState().selectedStyle;
    if(!selectedStyle) return false;
    
    const lastIndex = selectedStyle.lastIndexOf("_");
    const collectionId = selectedStyle.substring(0, lastIndex);
    const index = Number(selectedStyle.substring(lastIndex + 1));

    const {data} = Database;
    if(!data.styles) return false;

    if(!collectionId || Number.isNaN(index)) return false;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return false;

    const targetStyle = data.styles[collectionId][index];
    if(!targetStyle) return false;

    ActivePrompts.applyStyle(targetStyle, isAfter);

    return true;
}
