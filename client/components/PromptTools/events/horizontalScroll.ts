

export default function horizontalScroll(e: React.WheelEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    if(!e.deltaY) return;

    target.scrollLeft += e.deltaY + e.deltaX;
    e.preventDefault();
}
