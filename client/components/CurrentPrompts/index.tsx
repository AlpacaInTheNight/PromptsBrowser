import * as React from 'react'
import appStore, {ViewType} from 'client/store'
import PromptsList from 'client/components/PromptsList'
import ActivePrompts from 'client/managers/ActivePrompts'
import onPromptClick from './events/onClick'
import onPromptWheel from './events/onWheel'
import onPromptDoubleClick from './events/onDoubleClick'


export default function CurrentPrompts({tabName}: {
    tabName: string;
}) {
    const filesIteration = appStore(state => state.filesIteration);
    const modelIteration = appStore(state => state.modelIteration);
    const currentIteration = appStore(state => state.currentIteration);
    const showViews = appStore(state => state.showViews);
    const currentContainer = appStore(state => state.currentContainer);

    let render = true;
    if(!showViews.includes(ViewType.CURRENT)) render = false;
    if(currentContainer !== tabName) render = false;

    if(!render) return <div style={{display: "none"}} />;

    const activePrompts = ActivePrompts.getCurrentPrompts();

    return (
        <PromptsList
            iteration={currentIteration + filesIteration + modelIteration}
            prompts={activePrompts}
            allowMove={true}
            onClick={onPromptClick}
            onWheel={onPromptWheel}
            onDblClick={onPromptDoubleClick}
        />
    )
}
