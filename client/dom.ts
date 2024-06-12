
type MakeElementParams = {
    element: string;
    id: string;
    name: string;
    data: string;
    className: string;
    type: string;
    content: string;
    title: string;
    value: string | number | boolean;
    placeholder: string;
    style: CSSStyleDeclaration;
    checked: boolean;
    reverse: boolean;
    options: {id: string; name: string; }[];

    wrapper: HTMLElement;
    onChange: (this: HTMLElement, ev: Event) => void;
    onClick: (e: MouseEvent) => void;
}

function makeElement<T>(params: Partial<MakeElementParams>): T {
    if(!params) return;

    const {element, id, name, className, type, content, title, style, value, placeholder, onChange, onClick} = params;
    if(!element) return;

    const newElement = document.createElement(element) as any;
    if(type) newElement.type = type;
    if(id) newElement.id = id;
    if(name) newElement.name = name;
    if(className) newElement.className = className;
    if(content) newElement.innerText = content;
    if(title) newElement.title = title;
    if(value) newElement.value = value;
    if(placeholder) newElement.placeholder = placeholder;

    if(style) for(const i in style) newElement.style[i] = style[i];

    if(onChange) newElement.addEventListener("change", onChange);
    if(onClick) newElement.addEventListener("click", onClick);

    return newElement as T;
}

function makeCheckbox(params: Partial<MakeElementParams>) {
    if(!params) return;

    const {name = "", title = "", checked = false, id, data, onChange, reverse = false} = params;
    let {wrapper} = params;

    if(!wrapper) wrapper = makeElement({element: "div"});

    const checkBox = makeElement<HTMLInputElement>({...params, element: "input", type: "checkbox"});
    const boxTitle = makeElement<HTMLLabelElement>({element: "label", content: name, title});
    checkBox.checked = checked;

    if(reverse) {
        wrapper.appendChild(boxTitle);
        wrapper.appendChild(checkBox);
        
    } else {
        wrapper.appendChild(checkBox);
        wrapper.appendChild(boxTitle);
    }

    if(onChange) checkBox.addEventListener("change", onChange);

    if(id) {
        checkBox.name = id;
        boxTitle.htmlFor = id;
    }

    if(data) checkBox.dataset.id = data;
    
    return wrapper;
}

function makeSelect(params: Partial<MakeElementParams>) {
    if(!params) return;

    const {id, value = "", options = [], className, onChange, style} = params;

    const selectElement = makeElement<HTMLSelectElement>({element: "select", id, className, style});
    if(onChange) selectElement.addEventListener("change", onChange);

    let htmlOptions = "";
    for(const option of options) {
        htmlOptions += `<option value="${option.id}">${option.name}</option>`;
    }

    selectElement.innerHTML = htmlOptions;
    selectElement.value = value as string;
    
    return selectElement;
}

function makeDiv(params: Partial<MakeElementParams>): HTMLDivElement {
    return makeElement<HTMLDivElement>({...params, element: "div"});
}

export {
    makeElement,
    makeDiv,
    makeCheckbox,
    makeSelect,
}
