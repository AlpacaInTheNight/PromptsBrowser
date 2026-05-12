import * as React from 'react'
import { createRoot } from 'react-dom/client'
import StyleEdit from "./index"
import onClose from './events/onClose'
import appStaticStore from 'client/staticStore'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const styleEdit = document.createElement("div");
    styleEdit.className = "PBE_promptEdit PBE_generalWindow";
    styleEdit.id = "PBE_styleEdit";
    styleEdit.style.zIndex = "202";
    styleEdit.style.display = "none";
    wrapper.appendChild(styleEdit);

    styleEdit.addEventListener("mouseenter", () => {
        appStaticStore.onClose = onClose;
    });

    const root = createRoot(styleEdit);
    root.render(<StyleEdit parent={styleEdit} />);
}
