import * as React from 'react'
import { useState, useEffect } from 'react';
import tooltipStore from './store'
import ConfigManager from 'client/managers/Config'
import state from './state'
import ShowHints from './ShowHints';
import useToggleBox from './hooks/useToggleBox';
import initEvents from './utils/initEvents';


let initedEvents: boolean = false;

/**
 * A tooltip window that appears when typing a prompt in the current prompt textarea.
 */
export default function PromptTooltip({tabName}: {
    tabName: string;
}): React.JSX.Element | React.JSX.Element[] {
    const isActive = tooltipStore(state => state.isActive);
    const word = tooltipStore(state => state.word);
    const hints = tooltipStore(state => state.hints);
    const {autocomplitePromptMode = "prompts"} = ConfigManager.getConfig();
    if(autocomplitePromptMode === "off") return [];

    useEffect(() => {
        state.total = hints.length;
    }, [hints.length]);

    if(!initedEvents) {
        if(!initEvents()) return [];
        initedEvents = true;
    }

    useToggleBox(word, isActive);

    return ShowHints({hints}) || [];
}
