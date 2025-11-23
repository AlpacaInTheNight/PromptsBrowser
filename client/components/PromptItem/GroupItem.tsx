import * as React from 'react'
import { PromptGroup } from 'clientTypes/prompt'
import ConfigManager from 'client/managers/Config'
import { DEFAULT_PROMPT_WEIGHT } from 'client/const'
import ActivePrompts from 'client/managers/ActivePrompts'
import onDragStart from './events/onDragStart'
import onDragEnter from './events/onDragEnter'
import onDragLeave from './events/onDragLeave'
import onDrop from './events/onDrop'


export default function GroupItem({children, group, index, noWrap = false, allowMove = false, onClick, onWheel}: {
    group: PromptGroup;
    index: number;
    noWrap?: boolean;
    allowMove?: boolean;

    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;

    children: React.JSX.Element[];
}) {
    const {cardHeight = 100} = ConfigManager.getConfig();

    return (
        <div
            className={group.folded ? "PBE_promptsGroup PBE_promptsGroupFolded" : "PBE_promptsGroup"}
            style={{
                flexWrap: noWrap ? "nowrap" : "wrap",
            }}
        >
            <div className="PBE_groupHead"
                data-id={group.groupId}
                data-index={index}
                data-group={group.parentGroup}
                data-isgroup={"true"}
                style={{ height: cardHeight + "px"}}

                onClick={onClick}
                onWheel={onWheel}

                draggable={allowMove}
                onDragStart={allowMove ? onDragStart : undefined}
                onDragOver={allowMove ? (e => e.preventDefault()) : undefined}
                onDragEnter={allowMove ? onDragEnter : undefined}
                onDragLeave={allowMove ? onDragLeave : undefined}
                onDrop={allowMove ? onDrop : undefined}
            >
                {group.folded ? ActivePrompts.makeGroupKey(group) : ""}

                {(group.weight && group.weight !== DEFAULT_PROMPT_WEIGHT) ?
                    <div className="PBE_groupHeadWeight">{group.weight}</div>
                    :""
                }
            </div>
            
            {children}
        </div>
    )
}
