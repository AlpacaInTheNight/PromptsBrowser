import { TagTooltipStaticStore } from "../store";


export default function onChange(value: string) {
    const onUpdate = TagTooltipStaticStore.onUpdate;
    if(!onUpdate) return;

    let tags = value.split(",").map(item => item.trim());

    //removing empty tags
    tags = tags.filter(item => item);

    onUpdate(tags);
}
