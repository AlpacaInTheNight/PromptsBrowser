import * as React from 'react'
import Prompt from 'clientTypes/prompt'
import ConfigManager from 'client/managers/Config'
import { DEFAULT_PROMPT_WEIGHT } from 'client/const'
import getWeightStyle from './getWeightStyle'
import getSaveName from './getSaveName'
import WeightContainer from './WeightContainer'
import onMouseOver from './events/onMouseOver'
import onDragStart from './events/onDragStart'
import onDragEnter from './events/onDragEnter'
import onDragLeave from './events/onDragLeave'
import onDrop from './events/onDrop'


function PromptItem({id = "", src, prompt, options = {}, onClick, onDblClick, onWheel}: {
    id: string;
    prompt: Prompt;
    src: string;
    options?: {
        showIndex?: boolean;
        index?: number | string;
        parentGroup?: number | false;
        isShadowed?: boolean;
        noSplash?: boolean;
        className?: string;
        allowMove?: boolean;
    };

    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDblClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
}) {
    const {cardWidth = 50, cardHeight = 100, splashCardWidth = 200, splashCardHeight = 300} = ConfigManager.getConfig();
    const {index = 0, parentGroup = false, isShadowed = false, noSplash = false, showIndex = false, allowMove = false, className} = options;
    const {weight = DEFAULT_PROMPT_WEIGHT, isExternalNetwork = false, isSyntax = false} = prompt;

    const promptName = isSyntax ? id : getSaveName(id);
    const weightStyle = isSyntax ? false : getWeightStyle(weight);

    let addClass: string[] = ["PBE_promptElement", "PBE_currentElement"];
    if(className) addClass.push(className);
    if(isExternalNetwork) addClass.push("PBE_externalNetwork");
    if(isShadowed) addClass.push("PBE_shadowedElement");
    if(isSyntax) addClass.push("PBE_syntaxElement");

    return (
        <div
            key={id}
            className={addClass.join(" ")}
            style={{
                backgroundImage: src,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                zIndex: weightStyle ? weightStyle.zIndex : "",
                transform: weightStyle ? weightStyle.transform : "",
            }}
            data-prompt={id}
            data-index={index + ""}
            data-group={parentGroup !== false ? parentGroup : undefined}
            data-issyntax={isSyntax ? "true" : ""}
            

            onMouseOver={onMouseOver}
            onClick={onClick}
            onDoubleClick={onDblClick}
            onWheel={onWheel}

            draggable={allowMove}
            onDragStart={allowMove ? onDragStart : undefined}
            onDragOver={allowMove ? (e => e.preventDefault()) : undefined}
            onDragEnter={allowMove ? onDragEnter : undefined}
            onDragLeave={allowMove ? onDragLeave : undefined}
            onDrop={allowMove ? onDrop : undefined}
        >
            {showIndex && <div className="PBE_promptElementIndex">{index}</div>}

            {weight !== DEFAULT_PROMPT_WEIGHT &&
                <WeightContainer weight={weight} color={weightStyle ? weightStyle.color : ""} />
            }

            {promptName}

            {(!noSplash && !isSyntax) &&
                <div
                    className="PBE_promptElementSplash PBE_currentElement"
                    style={{
                        backgroundImage: src,
                        width: `${splashCardWidth}px`,
                        height: `${splashCardHeight}px`,
                        marginTop: `${cardHeight}px`,
                    }}
                >
                    {weight !== DEFAULT_PROMPT_WEIGHT &&
                        <WeightContainer weight={weight} color={weightStyle ? weightStyle.color : ""} />
                    }
                    {promptName}
                </div>
            }
        </div>
    )
}

export default React.memo(PromptItem);
