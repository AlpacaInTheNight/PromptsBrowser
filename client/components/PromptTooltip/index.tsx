import * as React from 'react'
import { useState, useEffect } from 'react';
import tooltipStore from './store'
import ConfigManager from 'client/managers/Config'
import state from './state'
import ShowHints from './ShowHints';
import useToggleBox from './hooks/useToggleBox';
import initEvents from './utils/initEvents';


let initedEvents: boolean = false;

export default function PromptTooltip({tabName}: {
    tabName: string;
}): React.JSX.Element | React.JSX.Element[] {
    const selected = tooltipStore(state => state.selected);
    const word = tooltipStore(state => state.word);
    const hints = tooltipStore(state => state.hints);
    const {autocomplitePromptMode = "prompts"} = ConfigManager.getConfig();
    if(autocomplitePromptMode === "off") return [];

    useEffect(() => {
        state.selected = selected;
    }, [selected]);

    useEffect(() => {
        state.total = hints.length;
    }, [hints.length]);

    if(!initedEvents) {
        if(!initEvents()) return [];
        initedEvents = true;
    }

    useToggleBox(word);

    return ShowHints({hints, selected}) || [];
}
