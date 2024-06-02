
/**
 * Prompt base.
 * This properties are stored in collection.
 */
type PromptBase = {
    id: string;

    category?: string[];

    tags?: string[];

    weight?: number;

    isExternalNetwork?: boolean;

    isSyntax?: boolean;

    addAtStart?: boolean;
    
    addAfter?: string;

    addStart?: string;

    addEnd?: string;

    comment?: string;

    previewImage?: "png" | "jpg";

    autogen?: {
        collection?: string;
        style?: string;
    }
}

/**
 * Additional properties used only on client.
 */
type PromptClient = {

    /**
     * In mixed list stores collection that have a preview for the target prompt.
     */
    knownPreviews?: {
        [key: string]: "png" | "jpg";
    }

    /**
     * In mixed list stores collections that have the target prompt.
     */
    collections?: string[];
    
}

/**
 * Additional properties related to prompts list. Like list of current active prompts or a saved prompts style.
 */
type PromptListItem = {

    /**
     * Id of the parent prompts group.
     */
    parentGroup?: number | false;

    /**
     * Index in the array of some prompts.
     */
    index?: number;

    /**
     * Tracks prompt weight relative to nesting.
     */
    nestedWeight?: number;

    /**
     * For syntax elements.
     */
    delimiter?: "none" | "prev" | "next" | "both";

}

type Prompt = PromptBase & PromptClient & PromptListItem;

type PromptGroup = {
    groupId: number;
    parentGroup?: number | false;
    weight: number;
    folded?: boolean;
    prompts: PromptEntity[];
    index?: number;
}

type PromptEntity = PromptGroup | Prompt;

export {
    PromptEntity,
    PromptGroup,
}

export default Prompt;
