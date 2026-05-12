import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import appStore from 'client/store'


export default function MetaBlock() {
    const [iterate, setIterate] = useState(0);
    const {editPrompt} = appStore.getState();
    let url: string = "";
    if(editPrompt?.meta?.url) url = editPrompt.meta.url;

    return (
        <>
            <div className="PBE_rowBlock" data-iterate={iterate}>
                <label>Associated url:</label>
                <input
                    className="PBE_generalInput PBE_promptEdit_url"
                    type="text"
                    value={url}
                    onChange={e => {
                        const value = e.currentTarget.value;
                        if(!editPrompt.meta) editPrompt.meta = {};
                        if(!value) delete editPrompt.meta.url;
                        else editPrompt.meta.url = value;

                        setIterate(iterate + 1);
                    }}
                />

                {url &&
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open
                    </a>
                }
            </div>

            <textarea
                data-iterate={iterate}
                id="PBE_commentArea"
                className="PBE_Textarea PBE_Scrollbar"
                value={editPrompt.comment || ""}

                onChange={e => {
                    editPrompt.comment = e.currentTarget.value;
                    setIterate(iterate + 1);
                }}
            />
        </>
    )
}
