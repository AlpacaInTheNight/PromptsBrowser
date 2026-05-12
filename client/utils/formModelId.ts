

export default function formModelId(checkpoint: string) {
    //removing the cache marker.
    const arr = checkpoint.split(" ");
    const lastPart = arr[arr.length - 1];
    if(lastPart && lastPart[0] === "[") arr.pop();
    checkpoint = arr.join(" ");

    //removing file extension
    checkpoint = checkpoint.replace(".safetensors", "");
    
    checkpoint = checkpoint.trim();

    return checkpoint;
}
