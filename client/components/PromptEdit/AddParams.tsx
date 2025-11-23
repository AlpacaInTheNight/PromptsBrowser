import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import Prompt from 'client/types/prompt'


export default function AddParams({prompt}: {
    prompt: Prompt;
}) {
    const [iterate, setIterate] = useState(0);
    if(!prompt) return;
    const {addAtStart = false, addAfter = "", addStart = "", addEnd = ""} = prompt;

    return (
        <>
            <div className="PBE_rowBlock">
                <label htmlFor="PBE_promptEdit_addAtStart">
                    Add at the beginning:
                </label>
                <input
                    id="PBE_promptEdit_addAtStart"
                    name="PBE_promptEdit_addAtStart"
                    className="PBE_promptEdit_addAtStart"
                    type="checkbox"
                    checked={addAtStart}
                    onChange={e => {
                        prompt.addAtStart = e.currentTarget.checked;
                        setIterate(iterate + 1);
                    }}
                />
            </div>

            <div className="PBE_rowBlock">
                <label>
                   Subsequent prompts:
                </label>
                <input
                    className="PBE_generalInput PBE_promptEdit_addAfter"
                    type="text"
                    value={addAfter}
                    onChange={e => {
                        prompt.addAfter = e.currentTarget.value;
                        setIterate(iterate + 1);
                    }}
                />
            </div>

            <div className="PBE_rowBlock">
                <label>
                   Add prompts at the start:
                </label>
                <input
                    className="PBE_generalInput PBE_promptEdit_addStart"
                    type="text"
                    value={addStart}
                    onChange={e => {
                        prompt.addStart = e.currentTarget.value;
                        setIterate(iterate + 1);
                    }}
                />
            </div>

            <div className="PBE_rowBlock">
                <label>
                   Add prompts at the end:
                </label>
                <input
                    className="PBE_generalInput PBE_promptEdit_addEnd"
                    type="text"
                    value={addEnd}
                    onChange={e => {
                        prompt.addEnd = e.currentTarget.value;
                        setIterate(iterate + 1);
                    }}
                />
            </div>
        </>
    )
}
