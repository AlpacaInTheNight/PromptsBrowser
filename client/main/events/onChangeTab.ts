import {setCurrentContainer} from 'client/store'


export default function onChangeTab(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase()
    if(tagName !== "button") return;

    const tabName = target.innerText.trim();
    if(!tabName) return;

    setCurrentContainer(tabName.toLowerCase());
}
