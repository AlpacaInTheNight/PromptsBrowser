import * as React from 'react'
import { createRoot } from 'react-dom/client'
import PromptTooltip from "./index"


export default function mount({wrapper, tabName}: {
    tabName: string;
    wrapper: HTMLElement;
}) {
    const promptTooltip = document.createElement("div");
    promptTooltip.className = "PBE_autocompliteBox";
    promptTooltip.id = "PBE_autocompliteBox";
    promptTooltip.style.zIndex = "10";
    wrapper.appendChild(promptTooltip);

    const root = createRoot(promptTooltip);
    root.render(<PromptTooltip tabName={tabName} />);
}
