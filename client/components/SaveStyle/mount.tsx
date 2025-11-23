import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {setShowSaveStyle} from 'client/store'
import appStaticStore from 'client/staticStore'
import SaveStyle from './index'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const saveStyle = document.createElement("div");
    saveStyle.className = "PBE_generalWindow PBE_stylesWindow";
    saveStyle.id = "PBE_saveStyleWindow";
    saveStyle.style.display = "none";
    wrapper.appendChild(saveStyle);

    saveStyle.addEventListener("mouseenter", () => {
        appStaticStore.onClose = () => setShowSaveStyle(false);
    });

    const root = createRoot(saveStyle);
    root.render(<SaveStyle parent={saveStyle} />);
}
