
const DnDInfo: {
    id?: string;
    index?: number;
    groupId?: number | false;
} = {

}

function clearDnD() {
    delete DnDInfo.id;
    delete DnDInfo.index;
    delete DnDInfo.groupId;
}

export default DnDInfo;

export {
    clearDnD,
}
