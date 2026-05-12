import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import appStore from 'client/store'
import PromptsList from 'client/components/PromptsList'


export default function PromptsBlock() {
    const [iterate, setIterate] = useState(0);
    const {editStyle} = appStore.getState();
    if(!editStyle) return <div style={{display: "none"}} />;
    const {positive, negative = ""} = editStyle;


    return (
        <>
            <div
                className="PBE_stylesCurrentList PBE_Scrollbar"
                style={{
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                }}
            >
                {(positive && positive.length !== 0) &&
                    <PromptsList
                        prompts={positive}
                        allowMove={false}
                        noWrap={false}
                    />
                }
            </div>

            <textarea
                data-iterate={iterate}
                id="PBE_commentArea"
                className="PBE_Textarea PBE_Scrollbar"
                value={negative}

                onChange={e => {
                    editStyle.negative = e.currentTarget.value;
                    setIterate(iterate + 1);
                }}
            />
        </>
    )
}
