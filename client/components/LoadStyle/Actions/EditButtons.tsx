import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import onUpdatePreview from '../events/onUpdatePreview';
import onUpdateStyle from '../events/onUpdateStyle';


export default function EditButtons() {

    return (
        <fieldset className="PBE_fieldset">
            <legend>Edit:</legend>

            <div
                className="PBE_button"
                title="Update selected style"
                onClick={e => onUpdateStyle()}
            >
                Update
            </div>

            <div
                className="PBE_button"
                title="Update selected style preview"
                onClick={e => onUpdatePreview()}
            >
                Update preview
            </div>
        </fieldset>
    )
}
