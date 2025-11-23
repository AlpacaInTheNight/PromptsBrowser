import * as React from 'react';
import { createRoot } from 'react-dom/client'
import appStaticStore from 'client/staticStore'
import PromptScribe from './index'
import onClose from './events/onClose';


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const promptScribe = document.createElement("div");
    promptScribe.className = "PBE_generalWindow PBE_promptScribe";
    promptScribe.id = "PBE_promptScribe";
    promptScribe.style.display = "none";
    wrapper.appendChild(promptScribe);

    promptScribe.addEventListener("mouseenter", () => {
        appStaticStore.onClose = onClose;
    });

    const root = createRoot(promptScribe);
    root.render(<PromptScribe parent={promptScribe} />);
}
