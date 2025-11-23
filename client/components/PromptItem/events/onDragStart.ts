import DnDInfo from "./DnDInfo";


export default function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    let index = Number(target.dataset.index);
    let group: number | false = Number(target.dataset.group);
    if(Number.isNaN(index)) return;
    if(Number.isNaN(group)) group = false;

    DnDInfo.index = index;
    DnDInfo.groupId = group;
    e.dataTransfer.setData("text", index + "");
}
