import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import appStore, {updateFilesIteration} from 'client/store'
import Database from 'client/Database'


export default function onCopyPrompt({copyOrMoveTo}: {
    copyOrMoveTo: string;
}) {
    const {data} = Database;
    const state = appStore.getState();
    const editPrompt = state.editPrompt;
    const editTargetCollection = state.editTargetCollection;
    if(!editPrompt || !copyOrMoveTo || !editTargetCollection) return;

    const to = copyOrMoveTo;
    const from = editTargetCollection;
    if(!to || !from) return;
    if(!data.original[to] || !data.original[from]) return;

    const originalItem = data.original[from].find(item => item.id === editPrompt.id);
    if(!originalItem) return;

    if(data.original[to].some(item => item.id === editPrompt.id)) return;
    data.original[to].push(JSON.parse(JSON.stringify(originalItem)));

    Database.movePreviewImage(editPrompt.id, from, to, "copy");
    Database.saveJSONData(to, true);
    Database.updateMixedList();

    updateFilesIteration();
}
