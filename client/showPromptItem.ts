import Prompt from "clientTypes/prompt";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import { replaceAllRegex } from "client/utils/index";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";

function onPromptCardHover(e: Event) {
    const {splashCardWidth = 200, splashCardHeight = 300} = PromptsBrowser.state.config;
    const target = e.currentTarget as HTMLElement;
    const splash = target.querySelector(".PBE_promptElementSplash") as HTMLElement;
    if(!splash) return;
    const BIG_CARD_HEIGHT = splashCardHeight;

    splash.style.display = "";
    const position = target.getBoundingClientRect();

    const bottomPosition = position.y + position.height + BIG_CARD_HEIGHT;

    if (bottomPosition < window.innerHeight) splash.style.top = position.top + "px";
    else splash.style.top = (position.top - position.height - BIG_CARD_HEIGHT) + "px";
    
    splash.style.left = position.left + "px";
}

/**
 * Shows prompt card
 */
function showPromptItem({prompt, options = {}}: {
    prompt: Prompt;
    options?: {
        url?: string;
        index?: number;
        parentGroup?: number | false;
        isShadowed?: boolean;
        noSplash?: boolean;
    };
}) {
    const {cardWidth = 50, cardHeight = 100, splashCardWidth = 200, splashCardHeight = 300} = PromptsBrowser.state.config;
    const {index = 0, parentGroup = false, isShadowed = false, noSplash = false, url} = options;
    const {id = "", weight = DEFAULT_PROMPT_WEIGHT, isExternalNetwork = false, isSyntax = false} = prompt;
    const imageSrc = url || Database.getPromptPreviewURL(id, undefined);

    const promptElement = document.createElement("div");
    const weightContainer = document.createElement("div");
    promptElement.className = "PBE_promptElement PBE_currentElement";
    promptElement.style.backgroundImage = imageSrc;
    promptElement.dataset.prompt = id;
    promptElement.dataset.index = index + "";
    if(parentGroup !== false) promptElement.dataset.group = parentGroup + "";
    promptElement.draggable = true;
    if(isExternalNetwork) promptElement.classList.add("PBE_externalNetwork");
    if(isShadowed) promptElement.classList.add("PBE_shadowedElement");
    if(isSyntax) promptElement.classList.add("PBE_syntaxElement");

    promptElement.style.width = `${cardWidth}px`;
    promptElement.style.height = `${cardHeight}px`;

    let promptName = id;

    if(!isSyntax) {
        promptName = replaceAllRegex(promptName, "\\\\", "");
        promptName = replaceAllRegex(promptName, ":", ": ");
        promptName = replaceAllRegex(promptName, "_", " ");
        promptName = replaceAllRegex(promptName, "{", "");
        promptName = replaceAllRegex(promptName, "}", "");

        if(weight !== DEFAULT_PROMPT_WEIGHT) {
            weightContainer.className = "PBE_promptElementWeight";
            weightContainer.innerText = weight + "";
    
            promptElement.appendChild(weightContainer);
        }
    
        if(weight < 1 && weight > 0.6) {
            promptElement.style.transform = "scale(0.9)";
            promptElement.style.zIndex = "3";
            weightContainer.style.color = "green";
    
        } else if(weight <= 0.6 && weight > 0.4) {
            promptElement.style.transform = "scale(0.8)";
            promptElement.style.zIndex = "2";
            weightContainer.style.color = "blue";
            
        } else if(weight <= 0.4) {
            promptElement.style.transform = "scale(0.7)";
            promptElement.style.zIndex = "1";
            weightContainer.style.color = "purple";
    
        }
    
        if(weight > 1 && weight <= 1.2) {
            promptElement.style.transform = "scale(1.1)";
            promptElement.style.zIndex = "4";
            weightContainer.style.color = "orange";
    
        } else if(weight > 1.2 && weight <= 1.3) {
            promptElement.style.transform = "scale(1.2)";
            promptElement.style.zIndex = "5";
            weightContainer.style.color = "orangered";
    
        } else if(weight > 1.3) {
            promptElement.style.transform = "scale(1.3)";
            promptElement.style.zIndex = "6";
            weightContainer.style.color = "red";
        }
    }

    if(!noSplash && !isSyntax) {
        const splashElement = document.createElement("div");
        splashElement.className = "PBE_promptElementSplash PBE_currentElement";
        splashElement.style.backgroundImage = imageSrc;
        splashElement.innerText = promptName;

        splashElement.style.width = `${splashCardWidth}px`;
        splashElement.style.height = `${splashCardHeight}px`;
        splashElement.style.marginTop = `${cardHeight}px`;

        if(weight !== DEFAULT_PROMPT_WEIGHT) {
            splashElement.appendChild(weightContainer.cloneNode(true));
        }

        promptElement.appendChild(splashElement);

        promptElement.addEventListener("mouseover", onPromptCardHover);
    }

    promptElement.innerHTML += promptName;
    return promptElement;
}

export default showPromptItem;
