import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import appStore from 'client/store';
import collectionToolsStore from './store';
import onSelectPrompt from './events/onSelectPrompt';
import checkFilter from '../ui/PromptsFilter/checkFilter';


export default function Content() {
    const {data} = Database;
    const filterCollection = appStore(state => state.filterCollection);
    const filesIteration = appStore(state => state.filesIteration);
    const selectedPrompts = collectionToolsStore(state => state.selectedPrompts);
    const promptsFilter = collectionToolsStore(state => state.promptsFilter);
    const iterate = collectionToolsStore(state => state.iterate);

    const targetCollection = data.original[filterCollection];
    if(!targetCollection) return <div />;

    const JSXPrompts: JSX.Element[] = [];

    targetCollection.forEach(item => {
        const { id, tags = [], category = [], comment = "" } = item;
        if (!id) return null;

        const isShown = checkFilter(item, promptsFilter);
        if (!isShown) return null;

        const isSelected = selectedPrompts.includes(id);

        JSXPrompts.push(
            <div
                key={id}
                className={
                    "PBE_detailedItem" +
                    (isSelected ? " selected" : "")
                }
            >
                <div
                    className="PBE_detailedItemSelector"
                    style={{
                        backgroundImage: Database.getPromptPreviewURL({
                            prompt: id,
                            collectionId: filterCollection,
                            filesIteration,
                        })
                    }}
                    onClick={onSelectPrompt}
                    data-id={id}
                />

                <div className="PBE_detailedItemContent">
                    <div className="PBE_detailedItemTop">
                        <div className="PBE_detailedItemName">{id}</div>
                        <div className="PBE_detailedItemComment">{comment}</div>
                    </div>

                    {(tags.length > 0 || category.length > 0) && (
                        <div className="PBE_detailedItemBottom">
                            {tags.length > 0 && (
                                <div className="PBE_detailedItemTags">
                                    {tags.join(", ")}
                                </div>
                            )}
                            {category.length > 0 && (
                                <div className="PBE_detailedItemCategories">
                                    {category.join(", ")}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    });

    return (
        <div
            className="PBE_dataBlock PBE_Scrollbar PBE_windowContent"
            data-iterate={iterate}
            data-files={filesIteration}
        >
            {JSXPrompts}
        </div>
    );
}
