import * as React from 'react'
import { JSX, useState, useEffect } from 'react';
import appStore from 'client/store'


function onAddTags(value: string) {
    const {editPrompt} = appStore.getState();
    if(!editPrompt) return;

    let tags = value.split(",").map(item => item.trim());

    //removing empty tags
    tags = tags.filter(item => item);

    for(const tag of tags) {
        if(editPrompt.tags.includes(tag)) continue;
        editPrompt.tags.push(tag);
    }
}

export default function TagsBlock() {
    const [iterate, setIterate] = useState(0);
    const [addTag, setAddTag] = useState("");
    const {editPrompt} = appStore.getState();
    const JSXTags: JSX.Element[] = [];

    if(editPrompt) {
        for(const tagItem of editPrompt.tags) {
            JSXTags.push(
                <div
                    key={tagItem}
                    className="PBE_promptEditInfoItem"
                    onClick={e => {
                        if(!e.metaKey && !e.ctrlKey) return;

                        const target = e.currentTarget as HTMLElement;
                        const tagId = target.innerText;

                        editPrompt.tags = editPrompt.tags.filter(item => item !== tagId);
                        setIterate(iterate + 1);
                    }}
                >
                    {tagItem}
                </div>
            )
        }
    }

    return (
        <>
            <div className="PBE_rowBlock" style={{marginBottom: "0"}}>
                <div>
                    Tags:
                </div>

                <div className="PBE_List PBE_Scrollbar PBE_tagsList">
                    {JSXTags}
                </div>
            </div>

            <div className="PBE_rowBlock">
                <input
                    id="PBE_addTagInput"
                    className="PBE_generalInput"
                    value={addTag}
                    onChange={e => {
                        setAddTag(e.currentTarget.value);
                    }}
                    onKeyUp={e => {
                        const target = e.currentTarget as HTMLInputElement;
                        if(e.keyCode !== 13) return;
                        if(target.dataset.hint) return;

                        onAddTags(addTag);
                        setAddTag("");
                        setIterate(iterate + 1);
                    }}
                />

                <button
                    className="PBE_button"
                    onClick={() => {
                        onAddTags(addTag);
                        setAddTag("");
                        setIterate(iterate + 1);
                    }}
                >
                    Add tag
                </button>
            </div>
        </>
    )
}
