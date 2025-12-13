import mountSetupWindow from 'client/components/SetupWindow/mount'
import mountPromptEdit from 'client/components/PromptEdit/mount'
import mountStyleEdit from 'client/components/StyleEdit/mount'
import mountLoadStyle from 'client/components/LoadStyle/mount'
import mountSaveStyle from 'client/components/SaveStyle/mount'
import mountPromptScribe from 'client/components/PromptScribe/mount'
import mountCollectionTools from 'client/components/CollectionTools/mount'
import mountPromptTools from 'client/components/PromptTools/mount'
import mountTagTooltip from 'client/components/ui/TagTooltip/mount'


export default function mountGlobal({mainContainer}: {
    mainContainer: HTMLElement;
}) {

    mountSetupWindow({wrapper: mainContainer});
    mountLoadStyle({wrapper: mainContainer});
    mountSaveStyle({wrapper: mainContainer});
    mountPromptScribe({wrapper: mainContainer});
    mountCollectionTools({wrapper: mainContainer});
    mountPromptTools({wrapper: mainContainer});
    mountPromptEdit({wrapper: mainContainer});
    mountStyleEdit({wrapper: mainContainer});
    mountTagTooltip({wrapper: mainContainer});

}
