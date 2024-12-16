let count = 0;
const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id == parentId) {
            count++;
            const newItem = item;
            newItem.index = count;
            // console.log(item._id.toString());
            const children = createTree(arr, item._id);
            if (children.length > 0) {
                newItem.children = children;
            }
            console.log(newItem);
            tree.push(newItem);
        }
        
    });
    return tree;
}

module.exports.createTree = (arr, parentId = "") => {
    count = 0;
    const tree = createTree(arr, parentId = "");
    return tree;
}