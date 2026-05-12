import Database from "./index";
import appStore from 'client/store'
import Style from "clientTypes/style";
import { makeFileNameSafe } from "client/utils/index";
import { EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT } from "client/const";


export default function getStylePreviewURL(style: Style) {
    const {filesIteration} = appStore.getState();
    if(!style) return NEW_CARD_GRADIENT;
    const {name, id, previewImage} = style;
    if(!name || !id || !previewImage) return NEW_CARD_GRADIENT;

    const apiUrl = Database.getAPIurl("styleImage");

    const safeFileName = makeFileNameSafe(name);

    const url = `url("${apiUrl}/${id}/${safeFileName}.${previewImage}?${filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
    return url;
}
