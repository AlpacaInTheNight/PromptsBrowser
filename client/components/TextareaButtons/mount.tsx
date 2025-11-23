import * as React from 'react';
import { createRoot } from 'react-dom/client';
import TextareaButtons from "./index";


export default function mount({positivePrompts, tabName}: {
    tabName: string;
    positivePrompts: HTMLElement;
}) {
    const textareaButtons = document.createElement("div");
    textareaButtons.className = "PBE_textarea_buttons_wrapper";
    positivePrompts.prepend(textareaButtons);

    const root = createRoot(textareaButtons);
    root.render(<TextareaButtons tabName={tabName} />);
}
