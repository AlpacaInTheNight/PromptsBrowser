import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import loadStyleStore, {setNewName} from '../store';
import onRenameStyle from '../events/onRenameStyle';


export default function StyleName() {
    const newName = loadStyleStore(state => state.newName);

    return (
        <fieldset className="PBE_fieldset">
            <legend>Name:</legend>

            <input
                type="text"
                className="PBE_generalInput PBE_input PBE_nameAction"
                placeholder="Style name"
                maxLength={150}
                value={newName}
                onChange={e => setNewName(e.currentTarget.value)}
            />

            <div
                className="PBE_button"
                title="Rename selected style"
                onClick={e => onRenameStyle()}
            >
                Rename
            </div>
        </fieldset>
    )
}
