import * as React from 'react';
import { createRoot } from 'react-dom/client';
import KnownPrompts from "./index";


export default function mount({wrapper, positivePrompts, tabName}: {
    tabName: string;
    wrapper: HTMLElement;
    positivePrompts: HTMLElement;
}) {
    const knownPrompts = document.createElement("div");
    knownPrompts.className = "PBE_promptsWrapper";
    wrapper.insertBefore(knownPrompts, positivePrompts);

    const root = createRoot(knownPrompts);
    root.render(<KnownPrompts tabName={tabName} />);
}
