import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ControlPanel from "./index";


export default function mount({wrapper, tabName}: {
    tabName: string;
    wrapper: HTMLElement;
}) {
    const controlPanel = document.createElement("div");
    wrapper.prepend(controlPanel);

    const root = createRoot(controlPanel);
    root.render(<ControlPanel tabName={tabName} />);
}
