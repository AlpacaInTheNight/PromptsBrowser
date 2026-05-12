import * as React from 'react'
import ActivePrompts from 'client/managers/ActivePrompts'
import ConfigManager from 'client/managers/Config'
import {updateCurrentIteration} from 'client/store'
import Prompt, {PromptGroup} from 'client/types/prompt'


function riseWeight(targetItem: Prompt | PromptGroup) {
    const {belowOneWeight = 0.05, aboveOneWeight = 0.01} = ConfigManager.getConfig();

    if(targetItem.weight < 1 && (targetItem.weight + belowOneWeight) > 1 ) {
        targetItem.weight = 1;

    } else {
        if(targetItem.weight >= 1) targetItem.weight += aboveOneWeight;
        else targetItem.weight += belowOneWeight;

    }
}

function lowerWeight(targetItem: Prompt | PromptGroup) {
    const {belowOneWeight = 0.05, aboveOneWeight = 0.01} = ConfigManager.getConfig();

    if(targetItem.weight > 1 && (targetItem.weight - aboveOneWeight) < 1 ) {
        targetItem.weight = 1;

    } else {
        if(targetItem.weight <= 1) targetItem.weight -= belowOneWeight;
        else targetItem.weight -= aboveOneWeight;

    }
}

/**
* Handles the mouse wheel event and changes the weight of the prompt
*/
export default function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    if(!e.shiftKey) return;
    const currentId = target.dataset.prompt;
    const groupId = Number(target.dataset.id);
    let index = Number(target.dataset.index);
    let group: number | false = Number(target.dataset.group);
    let targetItem: false | Prompt | PromptGroup = false;

    if(!Number.isNaN(groupId)) {
        //is prompts group
        targetItem = ActivePrompts.getGroupById(groupId);
        if(!targetItem) return;

    } else {
        //is prompt
        if(Number.isNaN(index)) return;
        if(Number.isNaN(group)) group = false;
        targetItem = ActivePrompts.getPromptByIndex(index, group);
        if(!targetItem) return;
        if(targetItem.isSyntax) return;
        if(!currentId) return;
    }

    if(!targetItem) return;

    e.preventDefault();
    e.stopPropagation();

    if(targetItem.weight === undefined) targetItem.weight = 1;

    if(e.deltaY < 0) riseWeight(targetItem);
    else lowerWeight(targetItem);

    if(targetItem.weight < 0) targetItem.weight = 0;
    targetItem.weight = Number(targetItem.weight.toFixed(2));

    if(targetItem.weight === 1) targetItem.weight = undefined;

    updateCurrentIteration();
    ActivePrompts.updateTextArea();
}
