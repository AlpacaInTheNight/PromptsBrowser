import * as React from 'react'
import { useState, useEffect } from 'react';
import {setHints} from '../store'
import getContainer from '../getContainer'
import getHintItems from '../utils/getHintItems'


export default function useToggleBox(word: string) {
    useEffect(() => {
        const autoCompleteBox = getContainer();
        if(!autoCompleteBox) return;

        const hints = getHintItems({word});
		setHints(hints);

        if(!hints || !hints.length) autoCompleteBox.style.display = "none";
        else autoCompleteBox.style.display = "";

	}, [word]);
}