import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore, {setShowLoadStyle} from "client/store";
import mount from './mount';
import Filter from './Filter';
import Actions from './Actions';
import LoadStyleContent from './Content';

export {mount}


export default function LoadStyle({parent}: {
    parent: HTMLDivElement;
}) {
    const showLoadStyle = appStore(state => state.showLoadStyle);

    useEffect(() => {
        if(!showLoadStyle) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [showLoadStyle]);

    if(!showLoadStyle) return <div />;

    return (
        <>
            <Filter />

            <LoadStyleContent />

            <Actions />

            <div className="PBE_rowBlock PBE_rowBlock_wide">
                <button
                    className="PBE_button"
                    onClick={() => setShowLoadStyle(false)}
                >
                    Close
                </button>
            </div>
        </>
    );
}
