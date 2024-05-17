import PromptsBrowser from "client/index";
import SetupWindow from "client/SetupWindow/index";

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
    
        const togglePanelButton = document.createElement("div");
        togglePanelButton.className = "PBE_toggleControlPanel";
    
        togglePanelButton.innerText = state.showControlPanel ? "◀" : "▶";
    
        togglePanelButton.addEventListener("click", ControlPanel.onTogglePanel);
    
        controlPanel.appendChild(togglePanelButton);
    
        if(!state.showControlPanel) return;
    
        const iconKnownPrompts = document.createElement("div");
        const iconCurrentPrompts = document.createElement("div");
        const iconPositiveTextArea = document.createElement("div");
        const iconNegativeTextArea = document.createElement("div");
    
        iconKnownPrompts.className = "PBE_controlIcon";
        iconCurrentPrompts.className = "PBE_controlIcon";
        iconPositiveTextArea.className = "PBE_controlIcon";
        iconNegativeTextArea.className = "PBE_controlIcon";
    
        if(state.showViews.includes("known")) iconKnownPrompts.classList.add("PBE_activeControlIcon");
        if(state.showViews.includes("current")) iconCurrentPrompts.classList.add("PBE_activeControlIcon");
        if(state.showViews.includes("positive")) iconPositiveTextArea.classList.add("PBE_activeControlIcon");
        if(state.showViews.includes("negative")) iconNegativeTextArea.classList.add("PBE_activeControlIcon");
    
        iconKnownPrompts.dataset.id = "known";
        iconCurrentPrompts.dataset.id = "current";
        iconPositiveTextArea.dataset.id = "positive";
        iconNegativeTextArea.dataset.id = "negative";
    
        iconKnownPrompts.innerText = "K";
        iconCurrentPrompts.innerText = "C";
        iconPositiveTextArea.innerText = "P";
        iconNegativeTextArea.innerText = "N";
    
        iconKnownPrompts.title = "Known prompts";
        iconCurrentPrompts.title = "Current prompts";
        iconPositiveTextArea.title = "Positive prompts textarea";
        iconNegativeTextArea.title = "Negative prompts textarea";
    
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
