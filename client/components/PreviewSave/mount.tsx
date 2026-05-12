import * as React from 'react';
import { createRoot } from 'react-dom/client';
import PreviewSave from "./index";


export default function mount({wrapper, tabName}: {
    tabName: string;
    wrapper: HTMLElement;
}) {
    const previewSave = document.createElement("div");
    wrapper.appendChild(previewSave);

    const root = createRoot(previewSave);
    root.render(<PreviewSave tabName={tabName} />);
}
