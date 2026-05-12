import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import onRemoveStyle from '../events/onRemoveStyle';


export default function SystemButtons() {

    return (
        <fieldset className="PBE_fieldset">
            <legend>System:</legend>

            <div
                className="PBE_button"
                title="Delete selected style"
                onClick={e => onRemoveStyle()}
            >
                Delete
            </div>
        </fieldset>
    )
}
