import appStore from 'client/store'


export default function onAddTags(tags: string[]) {
    const {editPrompt} = appStore.getState();
    if(!editPrompt) return;

    //removing empty tags
    tags = tags.filter(item => item);

    for(const tag of tags) {
        if(editPrompt.tags.includes(tag)) continue;
        editPrompt.tags.push(tag);
    }
}
