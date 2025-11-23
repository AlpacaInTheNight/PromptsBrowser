import Database from 'client/Database'
import appStore from 'client/store'
import Style from 'client/types/style'
import { ConfigTrackStyleMeta } from 'client/types/state'
import ConfigManager from 'client/managers/Config'
import ActivePrompts from 'client/managers/ActivePrompts'
import DOMCache from 'client/DOMCache'


export default function getStyle({styleName, collectionId, isUpdate = false}: {
    isUpdate?: boolean;
    styleName?: string;
    collectionId: string;
}) {
    const {data} = Database;
    const {saveStyleMeta = {} as ConfigTrackStyleMeta, updateStyleMeta = {} as ConfigTrackStyleMeta} = ConfigManager.getConfig();
    const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
    const {currentContainer} = appStore.getState();
    if(!collectionId) return;
    const activePrompts = ActivePrompts.getCurrentPrompts();

    if(!collectionId) return false;
    if(!data.styles) return false;

    const newStyle: Partial<Style> = {};

    let seed = undefined;
    let negative = undefined;
    let width = undefined;
    let height = undefined;
    let steps = undefined;
    let cfg = undefined;
    let sampling = undefined;
    
    const seedInput         = DOMCache.containers[currentContainer].seedInput;
    const negativePrompts   = DOMCache.containers[currentContainer].negativePrompts;

    const widthInput        = DOMCache.containers[currentContainer].widthInput;
    const heightInput       = DOMCache.containers[currentContainer].heightInput;
    const stepsInput        = DOMCache.containers[currentContainer].stepsInput;
    const cfgInput          = DOMCache.containers[currentContainer].cfgInput;
    const samplingInput     = DOMCache.containers[currentContainer].samplingInput;

    if(seedInput) {
        const seedValue = Number(seedInput.value);
        if(seedValue !== undefined && seedValue !== -1 && !Number.isNaN(seedValue)) seed = seedValue;
    }

    if(negativePrompts) {
        const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
        if(negativeTextAreas && negativeTextAreas[0]) negative = negativeTextAreas[0].value;
    }

    if(widthInput) width = Number(widthInput.value);
    if(heightInput) height = Number(heightInput.value);
    if(stepsInput) steps = Number(stepsInput.value);
    if(cfgInput) cfg = Number(cfgInput.value);
    if(samplingInput) sampling = samplingInput.value;

    if(Number.isNaN(width)) width = undefined;
    if(Number.isNaN(height)) height = undefined;
    if(Number.isNaN(steps)) steps = undefined;
    if(Number.isNaN(cfg)) cfg = undefined;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;
    
    if(styleName) newStyle.name = styleName;

    //positive prompts. added as array of prompt objects
    if(targetMeta.positive) {
        if(activePrompts && activePrompts.length) newStyle.positive = JSON.parse(JSON.stringify(activePrompts));
        else newStyle.positive = [];
    }

    if(targetMeta.seed && seed !== undefined) newStyle.seed = seed;

    //negative prompts. currently added as a string, may be changed to array of prompts in the future
    if(targetMeta.negative && negative !== undefined) newStyle.negative = negative;
    
    if(targetMeta.size && width !== undefined) newStyle.width = width;
    if(targetMeta.size && height !== undefined) newStyle.height = height;
    
    if(targetMeta.quality && steps !== undefined) newStyle.steps = steps;
    if(targetMeta.quality && cfg !== undefined) newStyle.cfg = cfg;
    
    if(targetMeta.sampler && sampling) newStyle.sampling = sampling;

    if(targetMeta.addType) newStyle.addType = targetMeta.addType;

    return newStyle;
}
