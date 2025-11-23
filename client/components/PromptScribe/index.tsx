import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore, {setShowPromptScribe} from 'client/store'
import mount from './mount'
import Header from './Header'
import UnknownPrompts from './UnknownPrompts'
import onClose from './events/onClose'

export {mount}


export default function PromptScribe({parent}: {
    parent: HTMLDivElement;
}) {
    const showPromptScribe = appStore(state => state.showPromptScribe);

    useEffect(() => {
        if(!showPromptScribe) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [showPromptScribe]);

    if(!showPromptScribe) return <div />;
    
    return (
        <>
            <Header />

            <UnknownPrompts />

            <div className="PBE_rowBlock PBE_rowBlock_wide">
                <button
                    className="PBE_button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </>
    )
}
