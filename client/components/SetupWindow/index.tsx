import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore, {setShowSetupWindowe} from "client/store";
import setupWindowStore, {setMode} from './store';
import Database from 'client/Database';
import CreateNew from './CreateNew';
import NewCollection from './NewCollection';
import onCreate from './events/onCreate';


export default function SetupWindow({parent}: {
    parent: HTMLDivElement;
}) {
    const {readonly} = Database.meta;
    const showSetupWindow = appStore(state => state.showSetupWindow);
    const mode = setupWindowStore(state => state.mode);

    useEffect(() => {
        if(!showSetupWindow) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [showSetupWindow]);

    if(!showSetupWindow) return <div />;

    return (
        <>
            {(mode === "main" && readonly === false) && <CreateNew />}

            {mode === "prompts" && <NewCollection />}

            {mode === "styles" && <NewCollection isStyles={true} />}

            <div className="PBE_setupWindowStatus PBE_row">
                version: {Database.meta.version}
                <a target='_blank' href='https://github.com/AlpacaInTheNight/PromptsBrowser'>Project Page</a>
            </div>

            <div className="PBE_rowBlock PBE_rowBlock_wide">

                {mode === "main" &&
                    <button
                        className="PBE_button"
                        onClick={() => setShowSetupWindowe(false)}
                    >
                        Close
                    </button>
                }

                {mode !== "main" &&
                    <button
                        className="PBE_button"
                        onClick={onCreate}
                        style={{
                            marginRight: "10px",
                        }}
                    >
                        Create
                    </button>
                }

                {mode !== "main" &&
                    <button
                        className="PBE_button PBE_buttonCancel"
                        onClick={() => setMode("main")}
                    >
                        Cancel
                    </button>
                }
            </div>
        </>
    );
}
