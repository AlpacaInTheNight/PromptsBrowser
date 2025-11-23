

//making sure Svelte will pick up and delegate changes in the input value
export default function triggerEvents(element: HTMLElement) {
    element.dispatchEvent(new KeyboardEvent('keypress'));
    element.dispatchEvent(new KeyboardEvent('input'));
    element.dispatchEvent(new KeyboardEvent('blur'));
}
