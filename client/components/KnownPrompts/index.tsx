import * as React from 'react'
import appStore, {ViewType} from 'client/store'
import ShowHeader from './ShowHeader'
import ShowContent from './ShowContent'


export default function KnownPrompts({tabName}: {
    tabName: string;
}) {
    const showViews = appStore(state => state.showViews);
    const currentContainer = appStore(state => state.currentContainer);

    let render = true;
    if(!showViews.includes(ViewType.KNOWN)) render = false;
    if(currentContainer !== tabName) render = false;

    if(!render) return <div style={{display: "none"}} />

    return (
        <div className="PBE_promptsCatalogue">
            <ShowHeader />
            <ShowContent />
        </div>
    );
}
