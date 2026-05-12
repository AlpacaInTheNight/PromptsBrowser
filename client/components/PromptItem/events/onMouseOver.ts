import * as React from 'react'
import ConfigManager from 'client/managers/Config'


export default function onPromptCardHover(e: React.MouseEvent<HTMLDivElement>) {
    const {splashCardWidth = 200, splashCardHeight = 300} = ConfigManager.getConfig();
    const target = e.currentTarget as HTMLElement;
    const splash = target.querySelector(".PBE_promptElementSplash") as HTMLElement;
    if(!splash) return;
    const BIG_CARD_HEIGHT = splashCardHeight;

    splash.style.display = "";
    const position = target.getBoundingClientRect();

    const bottomPosition = position.y + position.height + BIG_CARD_HEIGHT;

    if (bottomPosition < window.innerHeight) splash.style.top = position.top + "px";
    else splash.style.top = (position.top - position.height - BIG_CARD_HEIGHT) + "px";
    
    splash.style.left = position.left + "px";
}
