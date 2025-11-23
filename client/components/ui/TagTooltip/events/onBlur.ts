import tagTooltipStore from "../store";


let blurTimout: any = 0;

export default function onBlur() {
    const boxContainer = tagTooltipStore.getState().autocompliteBox;
    
    clearTimeout(blurTimout);

    blurTimout = setTimeout(() => {
        boxContainer.style.display = "none";
    }, 300);
    
}
