import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore, {setShowCollectionTools} from "client/store";
import mount from './mount';
import Header from './Header';
import Content from './Content';
import Status from './Status';
import Actions from './Actions';

export {mount}


export default function CollectionTools({parent}: {
    parent: HTMLDivElement;
}) {
    const showCollectionTools = appStore(state => state.showCollectionTools);

    useEffect(() => {
        if(!showCollectionTools) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [showCollectionTools]);

    if(!showCollectionTools) return <div />;

    return (
        <>
            <Header />

            <Content />

            <Status />

            <Actions />

            <div className="PBE_rowBlock PBE_rowBlock_wide">
                <button
                    className="PBE_button"
                    onClick={() => setShowCollectionTools(false)}
                >
                    Close
                </button>
            </div>
        </>
    );
}
