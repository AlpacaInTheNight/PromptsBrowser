import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import appStore from 'client/store'
import TagTooltip from 'client/components/ui/TagTooltip'
import onAddTags from './events/onAddTags'


export default function TagsBlock() {
    const [iterate, setIterate] = useState(0);
    const [addTagArr, setAddTagArr] = useState<string[]>([]);
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
                <TagTooltip
                    iteration={iterate}
                    tags={addTagArr}
                    onUpdate={newTags => {
                        setAddTagArr(newTags || []);
                    }}
                    onSubmit={() => {
                        onAddTags(addTagArr);
                        setAddTagArr([]);
                        setIterate(iterate + 1);
                    }}
                />

                <button
                    className="PBE_button"
                    onClick={() => {
                        onAddTags(addTagArr);
                        setAddTagArr([]);
                        setIterate(iterate + 1);
                    }}
                >
                    Add tag
                </button>
            </div>
        </>
    )
}
