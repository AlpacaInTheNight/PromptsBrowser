import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import onSaveStyle from './events/onSaveStyle'
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
                onClick={onSaveStyle}
            >
                Save
            </button>
        </div>
    )
}
