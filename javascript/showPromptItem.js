
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.onPromptCardHover = (e) => {
    const splash = e.currentTarget.querySelector(".PBE_promptElementSplash");
    if(!splash) return;
    const BIG_CARD_HEIGHT = 300;

    splash.style.display = "";
    const position = e.currentTarget.getBoundingClientRect();

    const bottomPosition = position.y + position.height + BIG_CARD_HEIGHT;

    if (bottomPosition < window.innerHeight) splash.style.top = position.top + "px";
    else splash.style.top = (position.top - position.height - BIG_CARD_HEIGHT) + "px";
    
    splash.style.left = position.left + "px";
}

/**
 * Shows prompt card
 */
PromptsBrowser.showPromptItem = (promptItem, options = {}) => {
    const {replaceAllRegex} = window.PromptsBrowser;
    const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
    const {index = 0, isShadowed = false, noSplash = false, url} = options;
    const {id = "", weight = DEFAULT_PROMPT_WEIGHT, isExternalNetwork = false} = promptItem;
    const imageSrc = url || PromptsBrowser.utils.getPromptPreviewURL(id, undefined);

    const promptElement = document.createElement("div");
    const weightContainer = document.createElement("div");
    promptElement.className = "PBE_promptElement PBE_currentElement";
    promptElement.style.backgroundImage = imageSrc;
    promptElement.dataset.prompt = id;
    promptElement.dataset.index = index;
    promptElement.draggable = "true";
    if(isExternalNetwork) promptElement.classList.add("PBE_externalNetwork");
    if(isShadowed) promptElement.classList.add("PBE_shadowedElement");

    let promptName = id;
    promptName = replaceAllRegex(promptName, "\\\\", "");
    promptName = replaceAllRegex(promptName, ":", ": ");
    promptName = replaceAllRegex(promptName, "_", " ");

    if(weight !== DEFAULT_PROMPT_WEIGHT) {
        weightContainer.className = "PBE_promptElementWeight";
        weightContainer.innerText = weight;

        promptElement.appendChild(weightContainer);
    }

    if(weight < 1 && weight > 0.6) {
        promptElement.style.transform = "scale(0.9)";
        promptElement.style.zIndex = 3;
        weightContainer.style.color = "green";

    } else if(weight <= 0.6 && weight > 0.4) {
        promptElement.style.transform = "scale(0.8)";
        promptElement.style.zIndex = 2;
        weightContainer.style.color = "blue";
        
    } else if(weight <= 0.4) {
        promptElement.style.transform = "scale(0.7)";
        promptElement.style.zIndex = 1;
        weightContainer.style.color = "purple";

    }

    if(weight > 1 && weight <= 1.2) {
        promptElement.style.transform = "scale(1.1)";
        promptElement.style.zIndex = 4;
        weightContainer.style.color = "orange";

    } else if(weight > 1.2 && weight <= 1.3) {
        promptElement.style.transform = "scale(1.2)";
        promptElement.style.zIndex = 5;
        weightContainer.style.color = "orangered";

    } else if(weight > 1.3) {
        promptElement.style.transform = "scale(1.3)";
        promptElement.style.zIndex = 6;
        weightContainer.style.color = "red";
    }

    if(!noSplash) {
        const splashElement = document.createElement("div");
        splashElement.className = "PBE_promptElementSplash PBE_currentElement";
        splashElement.style.backgroundImage = imageSrc;
        splashElement.innerText = promptName;

        if(weight !== DEFAULT_PROMPT_WEIGHT) {
            splashElement.appendChild(weightContainer.cloneNode(true));
        }

        promptElement.appendChild(splashElement);

        promptElement.addEventListener("mouseover", PromptsBrowser.onPromptCardHover);
    }

    promptElement.innerHTML += promptName;
    return promptElement;
}

