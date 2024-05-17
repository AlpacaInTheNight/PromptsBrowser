import PromptsBrowser from "client/index";
import SetupWindow from "client/SetupWindow/index";
import { makeDiv } from "client/dom";

class ControlPanel {

    public static init(wrapper: HTMLElement, containerId: string) {
        const controlPanel = document.createElement("div");
        controlPanel.className = "PBE_controlPanel";
    
        PromptsBrowser.DOMCache.containers[containerId].controlPanel = controlPanel;
        wrapper.prepend(controlPanel);
    }

    private static onTogglePanel(e: MouseEvent) {
        const {state} = PromptsBrowser;
    
        state.showControlPanel = !state.showControlPanel;
    
        ControlPanel.update();
        localStorage.setItem("showControlPanel", JSON.stringify(state.showControlPanel));
    }
    
    private static onToggleVisibility(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
    
        const id = target.dataset.id;
        if(!id) return;
        let targetWrapper = undefined;
    
        if(id === "known") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].promptBrowser;
        if(id === "current") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        if(id === "positive") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].positivePrompts;
        if(id === "negative") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].negativePrompts;
    
        if(!targetWrapper) return;
    
        if(state.showViews.includes(id)) {
            state.showViews = state.showViews.filter(item => item !== id);
            target.classList.remove("PBE_activeControlIcon");
            targetWrapper.style.display = "none";
    
        } else {
            state.showViews.push(id);
            target.classList.add("PBE_activeControlIcon");
            targetWrapper.style.display = "";
        }
    
        localStorage.setItem("PBE_showViews", JSON.stringify(state.showViews));
    }
    
    public static update() {
        const {state} = PromptsBrowser;
    
        const controlPanel = PromptsBrowser.DOMCache.containers[state.currentContainer].controlPanel;
        if(!controlPanel) return;
    
        controlPanel.innerHTML = "";
    
        if(state.showControlPanel) controlPanel.classList.remove("PBE_controlPanelHidden");
        else controlPanel.classList.add("PBE_controlPanelHidden");
    
        const togglePanelButton = makeDiv({content: state.showControlPanel ? "◀" : "▶", className: "PBE_toggleControlPanel"});
        togglePanelButton.addEventListener("click", ControlPanel.onTogglePanel);
    
        controlPanel.appendChild(togglePanelButton);
    
        if(!state.showControlPanel) return;
    
        const iconKnownPrompts      = makeDiv({content: "K", title: "Known prompts", className: "PBE_controlIcon"});
        const iconCurrentPrompts    = makeDiv({content: "C", title: "Current prompts", className: "PBE_controlIcon"});
        const iconPositiveTextArea  = makeDiv({content: "P", title: "Positive prompts textarea", className: "PBE_controlIcon"});
        const iconNegativeTextArea  = makeDiv({content: "N", title: "Negative prompts textarea", className: "PBE_controlIcon"});
    
        if(state.showViews.includes("known")) iconKnownPrompts.classList.add("PBE_activeControlIcon");
        if(state.showViews.includes("current")) iconCurrentPrompts.classList.add("PBE_activeControlIcon");
        if(state.showViews.includes("positive")) iconPositiveTextArea.classList.add("PBE_activeControlIcon");
        if(state.showViews.includes("negative")) iconNegativeTextArea.classList.add("PBE_activeControlIcon");
    
        iconKnownPrompts.dataset.id = "known";
        iconCurrentPrompts.dataset.id = "current";
        iconPositiveTextArea.dataset.id = "positive";
        iconNegativeTextArea.dataset.id = "negative";
    
        iconKnownPrompts.addEventListener("click", ControlPanel.onToggleVisibility);
        iconCurrentPrompts.addEventListener("click", ControlPanel.onToggleVisibility);
        iconPositiveTextArea.addEventListener("click", ControlPanel.onToggleVisibility);
        iconNegativeTextArea.addEventListener("click", ControlPanel.onToggleVisibility);
    
        const setupButton = document.createElement("button");
        setupButton.className = "PBE_button";
        setupButton.innerText = "New Collection";
        setupButton.style.marginRight = "10px";
    
        setupButton.addEventListener("click", SetupWindow.update);
    
        controlPanel.appendChild(setupButton);
    
        controlPanel.appendChild(iconKnownPrompts);
        controlPanel.appendChild(iconCurrentPrompts);
        controlPanel.appendChild(iconPositiveTextArea);
        controlPanel.appendChild(iconNegativeTextArea);
    }
}

export default ControlPanel;
