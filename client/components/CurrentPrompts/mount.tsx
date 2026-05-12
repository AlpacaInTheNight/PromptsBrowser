import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CurrentPrompts from "./index";

export default function mount({wrapper, tabName}: {
    tabName: string;
    wrapper: HTMLElement;
}) {
    const currentPrompts = document.createElement("div");
    currentPrompts.className = "PBE_currentPrompts";
    wrapper.appendChild(currentPrompts);

    const root = createRoot(currentPrompts);
    root.render(<CurrentPrompts tabName={tabName} />);
}
