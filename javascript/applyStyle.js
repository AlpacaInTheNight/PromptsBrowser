if(!window.PromptsBrowser) window.PromptsBrowser = {};

//making sure Svelte will pick up and delegate changes in the input value
window.PromptsBrowser.triggerEvents = function(element) {
    element.dispatchEvent(new KeyboardEvent('keypress'));
    element.dispatchEvent(new KeyboardEvent('input'));
    element.dispatchEvent(new KeyboardEvent('blur'));
}

window.PromptsBrowser.applyStyle = function(style, isAfter, override = false) {
    if(!style) return;
    const {state, triggerEvents} = PromptsBrowser;
    const {positive, negative, seed, width, height, steps, cfg, sampling} = style;

    if(override) PromptsBrowser.setCurrentPrompts([]);

    const activePrompts = PromptsBrowser.getCurrentPrompts();
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
                const {id} = prompt;
                if( activePrompts.some(item => item.id === id) ) continue;
        
                activePrompts.push({...prompt});
            }

        } else {
            for(let i = positive.length - 1; i >= 0; i--) {
                const prompt = positive[i];
                const {id} = prompt;
                if( activePrompts.some(item => item.id === id) ) continue;

                activePrompts.unshift({...prompt});
            }

        }
    }

    if(seed !== undefined && seedInput) {
        seedInput.value = seed;
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
        widthInput.value = width;
        triggerEvents(widthInput);
    }

    if(heightInput && height !== undefined) {
        heightInput.value = height;
        triggerEvents(heightInput);
    }

    if(stepsInput && steps !== undefined) {
        stepsInput.value = steps;
        triggerEvents(stepsInput);
    }

    if(cfgInput && cfg !== undefined) {
        cfgInput.value = cfg;
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

        inputWrapper.style.opacity = 0;
        samplingInput.dispatchEvent(new KeyboardEvent('focus'));

        clearTimeout(window.PromptsBrowser._timerSamplerA);
        clearTimeout(window.PromptsBrowser._timerSamplerB);

        window.PromptsBrowser._timerSamplerA = setTimeout(() => {
            samplingInput.value = sampling;
            samplingInput.dispatchEvent(new KeyboardEvent('keydown'));
            samplingInput.dispatchEvent(new KeyboardEvent('keyup'));
            samplingInput.dispatchEvent(new KeyboardEvent('input'));

            window.PromptsBrowser._timerSamplerB = setTimeout(() => {
                samplingInput.dispatchEvent(enterKeyEvent);
                inputWrapper.style.opacity = "";
                
            }, 100);
            
        }, 100);
    }

    PromptsBrowser.currentPrompts.update();
}