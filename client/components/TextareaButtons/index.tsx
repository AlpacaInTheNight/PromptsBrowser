import * as React from 'react';
import Database from 'client/Database'
import appStore, {setShowLoadStyle, setShowSaveStyle, setShowPromptScribe} from "client/store";
import mount from './mount';
import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'
import ActivePrompts from 'client/managers/ActivePrompts'

export {
    mount,
}


export default function TextareaButtons({tabName}: {
    tabName: string;
}) {
    const currentContainer = appStore(state => state.currentContainer);
    const {readonly} = Database.meta;

    if(currentContainer !== tabName) return <div style={{display: "none"}} />

    return (
        <>
            <button className="PBE_actionButton" onClick={() => setShowLoadStyle(true)}>Styles</button>
            
            {readonly !== true &&
                <button className="PBE_actionButton" onClick={() => setShowSaveStyle(true)}>Save style</button>
            }

            {readonly !== true &&
                <button className="PBE_actionButton" onClick={() => setShowPromptScribe(true)}>Add Unknown</button>
            }
            
            <button
                className="PBE_actionButton"
                onClick={() => {
                    syncCurrentPrompts(true, true);
                    ActivePrompts.updateTextArea();
                }}
            >
                Normalize
            </button>
        </>
    );
}
