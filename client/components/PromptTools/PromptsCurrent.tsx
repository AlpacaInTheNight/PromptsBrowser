import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import PromptsList from 'client/components/PromptsList'
import appStore from 'client/store';
import ActivePrompts from 'client/managers/ActivePrompts';
import horizontalScroll from './events/horizontalScroll';
import promptToolsStore from './store';
import { clone } from 'client/utils';
import ConfigPanel from './ConfigPanel';
import onChangeSelected from './events/onChangeSelected';


export default function PromptsCurrent() {
    const filesIteration = appStore(state => state.filesIteration);
    const currentIteration = appStore(state => state.currentIteration);
    const filtersCurrent = promptToolsStore(state => state.filtersCurrent);
    const iterate = promptToolsStore(state => state.iterate);

    const activePrompts = clone(ActivePrompts.getCurrentPrompts());

    return (
        <div className="PBE_dataBlock PBE_toolsHeader">

            <div
                className="PBE_windowCurrentList PBE_Scrollbar"
                onWheel={horizontalScroll}
            >
                <PromptsList
                    iteration={currentIteration + filesIteration + iterate}
                    filterSimple={filtersCurrent}
                    prompts={activePrompts}
                    allowMove={false}
                    onClick={onChangeSelected}
                    onWheel={undefined}
                    onDblClick={undefined}
                />
            </div>

            <ConfigPanel />

        </div>
    )
}
