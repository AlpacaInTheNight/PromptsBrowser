
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
     * Index in the array of some prompts.
     */
    index?: number;

    /**
     * Tracks prompt weight relative to nesting.
     */
    nestedWeight?: number;

    /**
     * In mixed list stores collection that have a preview for the target prompt.
     */
    knownPreviews?: {
        [key: string]: "png" | "jpg";
    }

    /**
     * In mixed list stores collection that have the target prompt.
     */
    collections?: string[];

    /**
     * For syntax elements.
     */
    delimiter?: "none" | "prev" | "next" | "both";
}

type Prompt = PromptBase & PromptClient;

export default Prompt;
