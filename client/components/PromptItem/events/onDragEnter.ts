import DnDInfo from "./DnDInfo";


export default function onDragEnter(e: React.DragEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;

    e.preventDefault();
    const dragIndex = Number(target.dataset.index);
    let dragGroup: number | false = Number(target.dataset.group);
    if(Number.isNaN(dragGroup)) dragGroup = false;

    const dropIndex = DnDInfo.index;
    const dropGroup = DnDInfo.groupId;

    //invalid element
    if(Number.isNaN(dragIndex) || dropIndex === undefined) return;

    //is the same element
    if(dragIndex === dropIndex && dragGroup === dropGroup) return;
    
    target.classList.add("PBE_swap");
}
