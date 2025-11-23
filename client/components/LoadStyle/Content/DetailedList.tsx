import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import loadStyleStore from '../store';
import getStyles from './utils/getStyles';
import PromptsList from 'client/components/PromptsList';
import ActivePrompts from 'client/managers/ActivePrompts';
import onBlockClick from './events/onBlockClick';
import onApplyStyle from '../events/onApplyStyle';
import onUpdatePreview from '../events/onUpdatePreview';
import onRemoveStyle from '../events/onRemoveStyle';
import onUpdateStyle from '../events/onUpdateStyle';


export default function DetailedList() {
    const {readonly} = Database.meta;

    const selectedStyle = loadStyleStore(state => state.selectedStyle);
    const filterStyleCollection = loadStyleStore(state => state.filterStyleCollection);
    const filterStyleName = loadStyleStore(state => state.filterStyleName);

    const activePrompts = ActivePrompts.getCurrentPrompts();

    const styles = getStyles();
    const JSXDetailedBlocks: JSX.Element[] = [];

    for(const style of styles) {
        const {name, positive, negative, width, height, steps, cfg, sampling, id, index, previewImage} = style;

        if(filterStyleCollection && filterStyleCollection !== id) continue;
        if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;

        const idKey = `${id}_${index}`;

        JSXDetailedBlocks.push(
            <div
                key={idKey}
                className={idKey === selectedStyle ? "PBE_styleItem PBE_selectedCurrentElement" : "PBE_styleItem"}
                style={{
                    backgroundImage: previewImage ? Database.getStylePreviewURL(style) : "",
                }}
                onClick={() => onBlockClick(idKey, name, id, index)}
            >
                <div className="PBE_styleHeader">
                    <div className="PBE_styleItemName">{name}</div>

                    {readonly === false &&
                        <button
                            className="PBE_button"
                            onClick={e => onUpdatePreview(id, name)}
                        >
                            Update preview
                        </button>
                    }
                </div>

                <div className="PBE_styleItemContent">
                    <div className="PBE_stylesCurrentList PBE_Scrollbar">
                        {(positive && positive.length !== 0) &&
                            <PromptsList
                                prompts={positive}
                                allowMove={false}
                                noWrap={true}
                            />
                        }
                    </div>

                    <div className="PBE_stylesAction">
                        <button
                            className="PBE_button"
                            onClick={() => onApplyStyle()}
                        >
                            Add before
                        </button>

                        {(activePrompts && activePrompts.length !== 0) &&
                            <button
                                className="PBE_button"
                                onClick={() => onApplyStyle(true)}
                            >
                                Add after
                            </button>
                        }

                        {readonly === false && <>
                            <button
                                className="PBE_button PBE_buttonCancel"
                                onClick={e => onRemoveStyle(id, index)}
                            >
                                Remove
                            </button>
                            
                            <button
                                className="PBE_button"
                                onClick={e => onUpdateStyle(id, index)}
                            >
                                Update
                            </button>
                        </>}
                    </div>
                </div>

                <div className="PBE_styleItemMetaInfo">
                    {negative &&<><span className="PBE_styleMetaField">Negative:</span> {negative}; </>}
                    {width && <><span className="PBE_styleMetaField">Width:</span> {width}; </>}
                    {height && <><span className="PBE_styleMetaField">Height:</span> {height}; </>}
                    {sampling && <><span className="PBE_styleMetaField">Sampling:</span> {sampling}; </>}
                    {steps && <><span className="PBE_styleMetaField">Steps:</span> {steps}; </>}
                    {cfg && <><span className="PBE_styleMetaField">CFG:</span> {cfg}; </>}
                </div>

            </div>
        )
    }

    return (
        <div className="PBE_dataColumn PBE_Scrollbar PBE_windowContent">
            {JSXDetailedBlocks}
        </div>
    )

}
