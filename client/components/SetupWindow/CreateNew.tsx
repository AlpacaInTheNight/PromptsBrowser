import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import {setMode, setColName} from './store';


export default function CreateNew() {

    return (
        <>
            <div className="PBE_row PBE_setupWindowTopBlock">

                <button
                    className="PBE_button"
                    onClick={e => {
                        setMode("prompts");
                        setColName("");
                    }}
                >
                    New prompts collection
                </button>

                <button
                    className="PBE_button"
                    onClick={e => {
                        setMode("styles");
                        setColName("");
                    }}
                >
                    New styles collection
                </button>

            </div>

            <div className="PBE_windowContent PBE_Scrollbar"></div>

        </>
    )
}
