import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import collectionToolsStore from './store';


export default function Status() {
    const autogenStatus = collectionToolsStore(state => state.autogenStatus);
    const selectedPrompts = collectionToolsStore(state => state.selectedPrompts);

    let selectionText = "";
    const prevItems = [];
    const MAX_SHOWN_DETAILED = 3;

    if(!selectedPrompts || !selectedPrompts.length) {
        selectionText = "No items selected";
        
    } else {
        for(let i = 0; i < selectedPrompts.length; i++) {
            if(i + 1 > MAX_SHOWN_DETAILED) break;
            prevItems.push(`"${selectedPrompts[i]}"`);
        }
    
        if(prevItems.length) selectionText += prevItems.join(", ");
    
        const allSelected = selectedPrompts.length;
        if(allSelected > MAX_SHOWN_DETAILED) {
            selectionText += `, and ${allSelected - MAX_SHOWN_DETAILED} more items selected.`
        }
    }

    return (
        <div className="PBE_collectionToolsStatus PBE_row">

            {autogenStatus !== "" &&
                <div className="PBE_collectionToolsAutogenInfo">
                    {autogenStatus}
                </div>
            }

            <div className="PBE_collectionToolsSelectedInfo">
                {selectionText}
            </div>
        </div>
    );
}
