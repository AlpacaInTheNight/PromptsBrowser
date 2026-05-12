import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import onApplyStyle from '../events/onApplyStyle';


export default function ActionButtons() {

    return (
        <fieldset className="PBE_fieldset">
            <legend>Actions:</legend>

            <div
                className="PBE_button"
                title="Add style prompts at the start of current prompts"
                onClick={() => onApplyStyle(false)}
            >
                Add before
            </div>

            <div
                className="PBE_button"
                title="Add style prompts at the end of current prompts"
                onClick={() => onApplyStyle(true)}
            >
                Add after
            </div>
        </fieldset>
    )
}
