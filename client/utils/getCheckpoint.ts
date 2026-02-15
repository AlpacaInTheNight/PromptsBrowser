import DOMCache from 'client/DOMCache'
import formModelId from './formModelId'


export default function getCheckpoint(): string | false {
    const checkpointSelector = DOMCache.modelCheckpoint;
    if(!checkpointSelector) return false;
    const input = checkpointSelector.querySelector("input");
    if(!input || !input.value) return false;
    const checkpoint = input.value;

    return formModelId(checkpoint);
}
