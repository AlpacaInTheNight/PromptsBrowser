import * as React from 'react'
import { createRoot } from 'react-dom/client'
import PromptTools from "./index"
import {setShowPromptTools} from 'client/store'
import appStaticStore from 'client/staticStore'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const promptTools = document.createElement("div");
    promptTools.className = "PBE_generalWindow PBE_promptTools";
    promptTools.id = "PBE_promptTools";
    promptTools.style.zIndex = "200";
    promptTools.style.display = "none";
    wrapper.appendChild(promptTools);

    promptTools.addEventListener("mouseenter", () => {
        appStaticStore.onClose = () => setShowPromptTools(false);
    });

    const root = createRoot(promptTools);
    root.render(<PromptTools parent={promptTools} />);
}
