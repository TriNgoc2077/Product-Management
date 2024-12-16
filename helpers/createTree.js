const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id == parentId) {
            const newItem = item;
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
    const tree = createTree(arr, parentId = "");
    return tree;
}