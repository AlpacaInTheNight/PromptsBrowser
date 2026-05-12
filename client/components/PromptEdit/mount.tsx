import * as React from 'react'
import { createRoot } from 'react-dom/client'
import PromptEdit from "./index"
import onClose from './events/onClose'
import appStaticStore from 'client/staticStore'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const promptEdit = document.createElement("div");
    promptEdit.className = "PBE_promptEdit PBE_generalWindow";
    promptEdit.id = "PBE_promptEdit";
    promptEdit.style.zIndex = "202";
    promptEdit.style.display = "none";
    wrapper.appendChild(promptEdit);

    promptEdit.addEventListener("mouseenter", () => {
        appStaticStore.onClose = onClose;
    });

    const root = createRoot(promptEdit);
    root.render(<PromptEdit parent={promptEdit} />);
}
