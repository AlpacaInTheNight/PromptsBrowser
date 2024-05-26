type AppContainer = {
    prompt: string;
    results: string;
    gallery: string;
    buttons: string;
    settings: string;
    seed: string;
    width: string;
    height: string;
    steps: string;
    cfg: string;
    sampling: string;
}

const supportedContainers: {[key: string]: AppContainer} = {
    text2Img: {
        prompt: "txt2img_prompt_container",
        results: "txt2img_results",
        gallery: "txt2img_gallery_container",
        buttons: "txt2img_generate_box",
        settings: "txt2img_settings",
        seed: "txt2img_seed",
        width: "txt2img_width",
        height: "txt2img_height",
        steps: "txt2img_steps",
        cfg: "txt2img_cfg_scale",
        sampling: "txt2img_sampling",
    },
    img2Img: {
        prompt: "img2img_prompt_container",
        results: "img2img_results",
        gallery: "img2img_gallery_container",
        buttons: "img2img_generate_box",
        settings: "img2img_settings",
        seed: "img2img_seed",
        width: "img2img_width",
        height: "img2img_height",
        steps: "img2img_steps",
        cfg: "img2img_cfg_scale",
        sampling: "img2img_sampling",
    }
}

export {
    AppContainer,
}
export default supportedContainers;
