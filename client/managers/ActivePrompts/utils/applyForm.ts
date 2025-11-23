import Style from "clientTypes/style";
import appStore from 'client/store'
import DOMCache from 'client/DOMCache'
import triggerEvents from "./triggerEvents";


let _timerSamplerA: any = 0;
let _timerSamplerB: any = 0;

export default function applyForm(style: Style) {
    if(!style) return false;
    const {currentContainer} = appStore.getState();
    const targetContainer = DOMCache.containers[currentContainer];
    if(!targetContainer) return false;

    const {negative, seed, width, height, steps, cfg, sampling} = style;

    const negativePrompts   = targetContainer.negativePrompts;
    const seedInput         = targetContainer.seedInput;
    const widthInput        = targetContainer.widthInput;
    const heightInput       = targetContainer.heightInput;
    const stepsInput        = targetContainer.stepsInput;
    const cfgInput          = targetContainer.cfgInput;
    const samplingInput     = targetContainer.samplingInput;

    if(seed !== undefined && seedInput) {
        seedInput.value = seed + "";
        triggerEvents(seedInput);
    }

    if(negativePrompts && negative) {
        const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
        if(negativeTextAreas && negativeTextAreas[0]) {
            const textArea =  negativeTextAreas[0]
            textArea.value = negative;

            triggerEvents(textArea);
        }
    }

    if(widthInput && width !== undefined) {
        widthInput.value = width + "";
        triggerEvents(widthInput);
    }

    if(heightInput && height !== undefined) {
        heightInput.value = height + "";
        triggerEvents(heightInput);
    }

    if(stepsInput && steps !== undefined) {
        stepsInput.value = steps + "";
        triggerEvents(stepsInput);
    }

    if(cfgInput && cfg !== undefined) {
        cfgInput.value = cfg + "";
        triggerEvents(cfgInput);
    }

    if(samplingInput && sampling) {
        const inputWrapper = samplingInput.parentElement.parentElement;

        const enterKeyEvent = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charCode: 13,
            keyCode: 13,
            view: window,
            bubbles: true
        });

        inputWrapper.style.opacity = "0";
        samplingInput.dispatchEvent(new KeyboardEvent('focus'));

        clearTimeout(_timerSamplerA);
        clearTimeout(_timerSamplerB);

        _timerSamplerA = setTimeout(() => {
            samplingInput.value = sampling;
            samplingInput.dispatchEvent(new KeyboardEvent('keydown'));
            samplingInput.dispatchEvent(new KeyboardEvent('keyup'));
            samplingInput.dispatchEvent(new KeyboardEvent('input'));

            _timerSamplerB = setTimeout(() => {
                samplingInput.dispatchEvent(enterKeyEvent);
                inputWrapper.style.opacity = "";
                
            }, 100);
            
        }, 100);
    }
}
