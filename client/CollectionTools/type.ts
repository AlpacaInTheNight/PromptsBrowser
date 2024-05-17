
type Autogen = {
    collection: string;
    style: string;
}

type GenerateRequest = {
    id: string;
    autogen?: Partial<Autogen>;
    addPrompts?: string;
}

export {
    Autogen,
    GenerateRequest,
}
