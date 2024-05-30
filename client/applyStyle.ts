import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import Style from "clientTypes/style";

//making sure Svelte will pick up and delegate changes in the input value
function triggerEvents(element: HTMLElement) {
    element.dispatchEvent(new KeyboardEvent('keypress'));
    element.dispatchEvent(new KeyboardEvent('input'));
    element.dispatchEvent(new KeyboardEvent('blur'));
}

let _timerSamplerA: any = 0;
let _timerSamplerB: any = 0;

function applyStyle(style: Style, isAfter: boolean, override: boolean = false) {
    if(!style) return;
    const {state} = PromptsBrowser;
    const {positive, negative, seed, width, height, steps, cfg, sampling} = style;

    if(override) ActivePrompts.setCurrentPrompts([]);

    const activePrompts = ActivePrompts.getCurrentPrompts();
    const negativePrompts = PromptsBrowser.DOMCache.containers[state.currentContainer].negativePrompts;
    const seedInput = PromptsBrowser.DOMCache.containers[state.currentContainer].seedInput;
    const widthInput = PromptsBrowser.DOMCache.containers[state.currentContainer].widthInput;
    const heightInput = PromptsBrowser.DOMCache.containers[state.currentContainer].heightInput;
    const stepsInput = PromptsBrowser.DOMCache.containers[state.currentContainer].stepsInput;
    const cfgInput = PromptsBrowser.DOMCache.containers[state.currentContainer].cfgInput;
    const samplingInput = PromptsBrowser.DOMCache.containers[state.currentContainer].samplingInput;

    if(positive && positive.length) {
        if(isAfter) {
            for(const prompt of positive) {
                //const {id, isSyntax} = prompt;
                //if(!isSyntax && activePrompts.some(item => item.id === id) ) continue;
        
                activePrompts.push({...prompt});
            }

        } else {
            for(let i = positive.length - 1; i >= 0; i--) {
                const prompt = positive[i];
                //const {id, isSyntax} = prompt;
                //if(!isSyntax && activePrompts.some(item => item.id === id) ) continue;

                activePrompts.unshift({...prompt});
            }

        }
    }

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

    CurrentPrompts.update();
}

export default applyStyle;
