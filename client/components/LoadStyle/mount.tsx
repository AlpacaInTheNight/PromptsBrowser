import * as React from 'react'
import { createRoot } from 'react-dom/client'
import LoadStyle from './index'
import {setShowLoadStyle} from 'client/store'
import appStaticStore from 'client/staticStore'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const loadStyle = document.createElement("div");
    loadStyle.className = "PBE_generalWindow PBE_stylesWindow";
    loadStyle.id = "PBE_stylesWindow";
    loadStyle.style.zIndex = "200";
    loadStyle.style.display = "none";
    wrapper.appendChild(loadStyle);

    loadStyle.addEventListener("mouseenter", () => {
        appStaticStore.onClose = () => setShowLoadStyle(false);
    });

    const root = createRoot(loadStyle);
    root.render(<LoadStyle parent={loadStyle} />);
}
