import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import onToggleSelected from '../events/onToggleSelected';
import onDeleteSelected from '../events/onDeleteSelected';


export default function Operations() {

    return (
        <fieldset className="PBE_fieldset">
            <legend>Actions</legend>

            <button
                className="PBE_button"
                title="Select and unselect all visible prompts"
                onClick={onToggleSelected}
            >
                Toggle all
            </button>

            <button
                className="PBE_button PBE_buttonCancel"
                title="Delete selected prompts"
                onClick={onDeleteSelected}
            >
                Delete selected
            </button>
        </fieldset>
    );
}
