import applyHint from "../utils/applyHint";


export default function onClickHint(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if(!target) return;

    const start = Number(target.dataset.start);
    const end = Number(target.dataset.end);
    const newTag = target.innerText;

    if(Number.isNaN(start) || Number.isNaN(end)) return;

    applyHint({start, end, newTag});
}
