import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CollectionTools from './index';
import {setShowCollectionTools} from 'client/store'
import appStaticStore from 'client/staticStore'


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const collectionTools = document.createElement("div");
    collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
    collectionTools.id = "PBE_collectionTools";
    collectionTools.style.display = "none";
    collectionTools.style.zIndex = "200";
    wrapper.appendChild(collectionTools);

    collectionTools.addEventListener("mouseenter", () => {
        appStaticStore.onClose = () => setShowCollectionTools(false);
    });

    const root = createRoot(collectionTools);
    root.render(<CollectionTools parent={collectionTools}/>);
}
