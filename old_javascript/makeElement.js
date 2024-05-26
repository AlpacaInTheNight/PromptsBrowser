if(!window.PromptsBrowser) window.PromptsBrowser = {};

window.PromptsBrowser.makeElement = function(params) {
    if(!params) return;

    const {element, id, name, className, type, content, title, style, value, placeholder, onChange} = params;
    if(!element) return;

    const newElement = document.createElement(element);
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

    return newElement;
}

window.PromptsBrowser.makeCheckbox = function(params) {
    if(!params) return;

    const {makeElement} = window.PromptsBrowser;
    const {name = "", title = "", checked = false, id, data, onChange, reverse = false} = params;
    let {wrapper} = params;

    if(!wrapper) wrapper = makeElement({element: "div"});

    const checkBox = makeElement({...params, element: "input", type: "checkbox"});
    const boxTitle = makeElement({element: "label", content: name, title});
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

window.PromptsBrowser.makeSelect = function(params) {
    if(!params) return;

    const {makeElement} = window.PromptsBrowser;
    const {id, value = "", options = [], className, onChange, style} = params;

    const selectElement = makeElement({element: "select", id, className, style});
    if(onChange) selectElement.addEventListener("change", onChange);

    let htmlOptions = "";
    for(const option of options) {
        htmlOptions += `<option value="${option.id}">${option.name}</option>`;
    }

    selectElement.innerHTML = htmlOptions;
    selectElement.value = value;
    
    return selectElement;
}
