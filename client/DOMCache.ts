
const DOMCache: {
    mainContainer?: ShadowRoot | HTMLElement;
    modelCheckpoint?: HTMLElement;

    containers: {
        [key: string]: {
            promptContainer: HTMLElement;
            positivePrompts: HTMLElement;
            negativePrompts: HTMLElement;
            buttonsContainer: HTMLElement;
            generateButton: HTMLElement;
            resultsContainer: HTMLElement;
            textArea: HTMLTextAreaElement;
            imageArea: HTMLElement;
            tooltipWindow: HTMLElement;

            seedInput: HTMLInputElement;
            widthInput: HTMLInputElement;
            heightInput: HTMLInputElement;
            stepsInput: HTMLInputElement;
            cfgInput: HTMLInputElement;
            samplingInput: HTMLSelectElement;
        }
    };
} = {
    containers: {},
};

export default DOMCache;
