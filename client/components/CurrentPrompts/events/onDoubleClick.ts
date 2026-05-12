import * as React from 'react'
import { setShowPromptTools, setEditPromptIndex, setEditPromptGroup } from 'client/store'


export default function onPromptDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    let index: number | false = Number(target.dataset.index);
    let group: number | false = Number(target.dataset.group);

    if(Number.isNaN(index)) index = false;
    if(Number.isNaN(group)) group = false;

    if(index === false) return;

    setEditPromptIndex(index);
    setEditPromptGroup(group);
    setShowPromptTools(true);
}
