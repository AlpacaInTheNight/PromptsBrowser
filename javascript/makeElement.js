if(!window.PromptsBrowser) window.PromptsBrowser = {};

window.PromptsBrowser.makeElement = function(params) {
    if(!params) return;

    const {element, id, className, type, content, title} = params;
    if(!element) return;

    const newElement = document.createElement(element);
    if(type) newElement.type = type;
    if(id) newElement.id = id;
    if(className) newElement.className = className;
    if(content) newElement.innerText = content;
    if(title) newElement.title = title;

    return newElement;
}

window.PromptsBrowser.makeCheckbox = function(params) {
    if(!params) return;

    const {makeElement} = window.PromptsBrowser;
    const {title, checked = false, id, data, onChange} = params;

    const wrapper = makeElement({element: "div"});

    const checkBox = makeElement({...params, element: "input", type: "checkbox"});
    const boxTitle = makeElement({element: "label", content: title, title});
	checkBox.checked = checked;

    wrapper.appendChild(checkBox);
    wrapper.appendChild(boxTitle);

    if(onChange) checkBox.addEventListener("change", onChange);

    if(id) {
        checkBox.name = id;
        boxTitle.htmlFor = id;
    }

    if(data) checkBox.dataset.id = data;
	
    return wrapper;
}