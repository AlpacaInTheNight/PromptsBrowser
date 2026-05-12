import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import onSavePrompt from './events/onSavePrompt'
import onClose from './events/onClose'


export default function Footer() {

    return (
        <div
            className="PBE_rowBlock PBE_rowBlock_wide"
            style={{
                justifyContent: "space-around",
            }}
        >
            <button
                className="PBE_button PBE_buttonCancel"
                onClick={onClose}
            >
                Cancel
            </button>

            <button
                className="PBE_button"
                onClick={onSavePrompt}
            >
                Save
            </button>
        </div>
    )
}
