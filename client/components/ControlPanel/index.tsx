import * as React from 'react';
import appStore, {setShowControlPanel, setShowSetupWindowe, ViewType, toggleView} from "client/store";
import mount from './mount';

export {
    mount,
}

export default function ControlPanel({tabName}: {
    tabName: string;
}) {
    const showControlPanel = appStore(state => state.showControlPanel);
    const currentContainer = appStore(state => state.currentContainer);
    const showViews = appStore(state => state.showViews);

    if(currentContainer !== tabName) return <div style={{display: "none"}} />

    const activeIcon = "PBE_activeControlIcon PBE_controlIcon";
    const inactiveIcon = "PBE_controlIcon";

    return (
        <div className={showControlPanel ? "PBE_controlPanel" : "PBE_controlPanel PBE_controlPanelHidden"}>
            <div className="PBE_toggleControlPanel" onClick={() => setShowControlPanel(!showControlPanel)}>
                {showControlPanel ? "◀" : "▶"}
            </div>

            {showControlPanel && <>
                <button
                    className="PBE_button"
                    style={{
                        marginRight: "10px",
                    }}
                    onClick={e => setShowSetupWindowe(true)}
                >
                    New Collection
                </button>

                <div
                    onClick={() => toggleView(ViewType.KNOWN)}
                    className={showViews.includes(ViewType.KNOWN) ? activeIcon : inactiveIcon}
                    title="Known prompts"
                >K</div>

                <div
                    onClick={() => toggleView(ViewType.CURRENT)}
                    className={showViews.includes(ViewType.CURRENT) ? activeIcon : inactiveIcon}
                    title="Current prompts"
                >C</div>

                <div
                    onClick={() => toggleView(ViewType.POSITIVE)}
                    className={showViews.includes(ViewType.POSITIVE) ? activeIcon : inactiveIcon}
                    title="Positive prompts textarea"
                >P</div>

                <div
                    onClick={() => toggleView(ViewType.NEGATIVE)}
                    className={showViews.includes(ViewType.NEGATIVE) ? activeIcon : inactiveIcon}
                    title="Negative prompts textarea"
                >N</div>
            </>}
        </div>
    );
}
