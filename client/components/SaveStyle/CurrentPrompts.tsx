import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import PromptsList from 'client/components/PromptsList'
import appStore from 'client/store';
import ActivePrompts from 'client/managers/ActivePrompts';
import saveStyleStore from './store';
import { clone } from 'client/utils';
import onClickPrompt from './events/onClickPrompt';


export default function PromptsCurrent() {
    const filesIteration = appStore(state => state.filesIteration);
    const currentIteration = appStore(state => state.currentIteration);
    const iterate = saveStyleStore(state => state.iterate);

    const activePrompts = clone(ActivePrompts.getCurrentPrompts());

    return (
        <div
            className="PBE_dataBlock PBE_Scrollbar PBE_windowContent"
        >
            <PromptsList
                iteration={currentIteration + filesIteration + iterate}
                prompts={activePrompts}
                allowMove={false}
                onClick={onClickPrompt}
            />
        </div>
    )
}
