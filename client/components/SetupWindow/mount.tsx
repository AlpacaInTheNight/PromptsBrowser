import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {setShowSetupWindowe} from 'client/store'
import appStaticStore from 'client/staticStore'
import SetupWindow from './index'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const setupWindow = document.createElement("div");
    setupWindow.className = "PBE_setupWindow PBE_generalWindow";
    setupWindow.style.display = "none";
    setupWindow.style.zIndex = "200";
    wrapper.appendChild(setupWindow);

    setupWindow.addEventListener("mouseenter", () => {
        appStaticStore.onClose = () => setShowSetupWindowe(false);
    });

    const root = createRoot(setupWindow);
    root.render(<SetupWindow parent={setupWindow}/>);
}
