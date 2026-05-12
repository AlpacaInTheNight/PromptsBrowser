import * as React from 'react'
import { useState } from 'react'
import appStore from 'client/store'


export default function AddSetup() {
    const [iterate, setIterate] = useState(0);
    const {editPrompt} = appStore.getState();
 
    return (
        <>
            <div
                data-iterate={iterate}
                className="PBE_rowBlock"
                style={{height: "40px"}}
            >
                <label htmlFor="PBE_promptEdit_addAtStart">
                    Add at the beginning:
                </label>

                <input
                    className="PBE_promptEdit_addAtStart"
                    type="checkbox"
                    id="PBE_promptEdit_addAtStart"
                    name="PBE_promptEdit_addAtStart"
                    checked={editPrompt.addAtStart}
                    onChange={e => {
                        editPrompt.addAtStart = e.currentTarget.checked;
                        setIterate(iterate + 1);
                    }}
                />
            </div>

            <div
                data-iterate={iterate}
                className="PBE_rowBlock"
                style={{height: "40px"}}
            >
                <label>
                    Subsequent prompts:
                </label>

                <input
                    className="PBE_generalInput PBE_promptEdit_addAfter"
                    type="text"
                    value={editPrompt.addAfter}
                    onChange={e => {
                        editPrompt.addAfter = e.currentTarget.value;
                        setIterate(iterate + 1);
                    }}
                />
            </div>

            <div
                data-iterate={iterate}
                className="PBE_rowBlock"
                style={{height: "40px"}}
            >
                <label>
                    Add prompts at the start:
                </label>

                <input
                    className="PBE_generalInput PBE_promptEdit_addStart"
                    type="text"
                    value={editPrompt.addStart}
                    onChange={e => {
                        editPrompt.addStart = e.currentTarget.value;
                        setIterate(iterate + 1);
                    }}
                />
            </div>

            <div
                data-iterate={iterate}
                className="PBE_rowBlock"
                style={{height: "40px"}}
            >
                <label>
                    Add prompts at the end:
                </label>

                <input
                    className="PBE_generalInput PBE_promptEdit_addEnd"
                    type="text"
                    value={editPrompt.addEnd}
                    onChange={e => {
                        editPrompt.addEnd = e.currentTarget.value;
                        setIterate(iterate + 1);
                    }}
                />
            </div>
        </>
    )
}
