import * as React from 'react'
import { useState, useEffect } from 'react'
import appStore from 'client/store'
import Database from 'client/Database'
import TagsBlock from './TagsBlock'
import CategoriesBlock from './CategoriesBlock'
import CollectionAction from './CollectionAction'
import CollectionSelector from './CollectionSelector'
import ShowPreviews from './Previews'
import Footer from './Footer'
import AutoGenBlock from './AutoGenBlock'
import AddSetup from './AddSetup'
import MetaBlock from './MetaBlock'


export default function PromptEdit({parent}: {
    parent: HTMLDivElement;
}) {
    const {original} = Database.data;
    const editPrompt = appStore(state => state.editPrompt);
    const filesIteration = appStore(state => state.filesIteration);

    useEffect(() => {
        if(!editPrompt) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [editPrompt ? editPrompt.id : false]);

    if(!editPrompt) return <div data-iteration={filesIteration} />;

    return (
        <>
            <div
                className="PBE_rowBlock PBE_rowBlock_wide"
                data-iteration={filesIteration}
                style={{
                    justifyContent: "space-around",
                }}
            >
                <div className="PBE_promptEditTitle">{editPrompt.id}</div>

                <CollectionSelector />
            </div>

            <div
                className="PBE_dataBlock PBE_Scrollbar PBE_windowContent"
                style={{
                    width: "100%",
                }}
            >
                <div className="PBE_contentPanel">
                    {(Object.keys(original).length > 1) &&
                        <CollectionAction />
                    }

                    <TagsBlock />

                    <CategoriesBlock />

                    <AutoGenBlock />

                    <AddSetup />

                    <ShowPreviews prompt={editPrompt} />
                </div>

                <div className="PBE_contentPanel">
                    <MetaBlock />
                </div>
            </div>

            <Footer />
        </>
    )
}
