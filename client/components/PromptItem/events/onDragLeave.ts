

export default function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("PBE_swap");
}
