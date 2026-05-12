import * as React from 'react'
import { useState, useEffect } from 'react'
import appStore from 'client/store'
import PromptsBlock from './PromptsBlock'
import MetaBlock from './MetaBlock'
import Footer from './Footer'


export default function StyleEdit({parent}: {
    parent: HTMLDivElement;
}) {
    const editStyle = appStore(state => state.editStyle);
    const filesIteration = appStore(state => state.filesIteration);

    useEffect(() => {
        if(!editStyle) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [editStyle ? editStyle.name : false]);

    if(!editStyle) return <div data-iteration={filesIteration} />;

    return (
        <>
            <div
                className="PBE_rowBlock PBE_rowBlock_wide"
                data-iteration={filesIteration}
                style={{
                    justifyContent: "space-around",
                }}
            >
                <div className="PBE_promptEditTitle">{editStyle.name}</div>
            </div>

            <div
                className="PBE_dataBlock PBE_Scrollbar PBE_windowContent"
                style={{
                    width: "100%",
                }}
            >
                <div className="PBE_contentPanel" style={{width: "40%"}}>
                    <MetaBlock />
                </div>

                <div className="PBE_contentPanel" style={{width: "40%"}}>
                    <PromptsBlock />
                </div>
            </div>

            <Footer />
        </>
    )
}
