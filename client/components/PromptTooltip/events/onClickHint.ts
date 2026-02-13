import tooltipStore from '../store'
import onApplyHint from './onApplyHint'
import onApplyStyleHint from './onApplyStyleHint'
import { setIsActive } from '../store';


export default function onClickHint(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    if(!target) return;

    const name = target.dataset.id;
    if(!name) return;

    const collection = target.dataset.collection;
    const {start, end} = tooltipStore.getState();
    const isStyle: boolean = !!target.dataset.isstyle;

    if(isStyle) onApplyStyleHint(start, end, name, collection);
    else onApplyHint(start, end, name);

    setIsActive(true);
}
