import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore, {setShowSaveStyle} from "client/store";
import mount from './mount';
import PromptsCurrent from './CurrentPrompts';
import AddStyle from './AddStyle';

export {mount}


export default function SaveStyle({parent}: {
    parent: HTMLDivElement;
}) {
    const showSaveStyle = appStore(state => state.showSaveStyle);

    useEffect(() => {
        if(!showSaveStyle) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [showSaveStyle]);

    if(!showSaveStyle) return <div />;

    return (
        <>
            <AddStyle />

            <PromptsCurrent />

            <div className="PBE_rowBlock PBE_rowBlock_wide">
                <button
                    className="PBE_button"
                    onClick={() => setShowSaveStyle(false)}
                >
                    Close
                </button>
            </div>
        </>
    );
}
