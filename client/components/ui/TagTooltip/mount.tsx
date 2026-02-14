import * as React from 'react'
import { createRoot } from 'react-dom/client'
import AutocompliteBox from './AutocompliteBox';
import {setAutocompliteBox} from './store';


export default function mount({wrapper}: {
    wrapper: HTMLElement;
}) {
    const autocompliteBox = document.createElement("div");
    autocompliteBox.className = "PBE_autocompliteBox PBE_autocompliteTags";
    autocompliteBox.id = "PBE_autocompliteTags";
    autocompliteBox.style.position = "fixed";
    autocompliteBox.style.display = "none";
    wrapper.appendChild(autocompliteBox);
    setAutocompliteBox(autocompliteBox);

    const root = createRoot(autocompliteBox);
    root.render(<AutocompliteBox />);
}
