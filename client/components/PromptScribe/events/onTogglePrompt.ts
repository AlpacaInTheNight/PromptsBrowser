import promptScribeStore, {setSelectedNewPrompts} from '../store';


export default function onTogglePrompt(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLDivElement;
    const id = target.dataset.prompt;
    if(!id) return;
    let selectedNewPrompts = promptScribeStore.getState().selectedNewPrompts;

    if(selectedNewPrompts.includes(id)) {
        selectedNewPrompts = selectedNewPrompts.filter(item => item !== id);
    } else {
        selectedNewPrompts.push(id);
    }

    setSelectedNewPrompts([...selectedNewPrompts]);
}
